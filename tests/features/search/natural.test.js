import { Filter, FILTER_MODE_AND, FILTER_MODE_OR, FILTER_OPER_LIKE, FILTER_OPER_EQUAL } from '../../../src/features/filter';
import {
  normalizeCatalog,
  catalogToJson,
  fieldsForNatural,
  buildNaturalPrompt,
  buildNaturalSchema,
  buildNaturalRequest,
  parseNaturalContent,
  matchOption,
  naturalToCriteria,
  naturalToResult,
  createNaturalLanguage,
  filterToSentence,
} from '../../../src/features/search';
import { donorCatalog } from './fixtures';

const normalize = value => {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  const keys = Object.keys(value);
  if (Array.isArray(value) && keys.every(k => /^\d+$/.test(k))) {
    return value.map(normalize);
  }
  return keys.reduce((acc, key) => {
    acc[key] = normalize(value[key]);
    return acc;
  }, {});
};
const api = filter => normalize(filter.asJsonApiObject());

/* Le catalogue des fixtures, avec ce que l'étape 4 ajoute : descriptions pour le
   modèle, un champ tenu à l'écart, un picker, un caché. */
const catalog = () =>
  normalizeCatalog(
    donorCatalog().concat([
      { name: 'donations.lang.lang_id', label: 'Langue', type: 'select', options: [{ value: 1, label: 'Français' }], hidden: true },
      { name: 'cause.cau_id', label: 'Cause', type: 'picker', picker: { onSearch: () => {} } },
    ]).map(field => {
      if (field.name === 'donations.grp_id') {
        return { ...field, llm: false };
      }
      if (field.name === 'last_donation.don_real_ts') {
        return { ...field, description: 'date du dernier paiement reçu' };
      }
      return field;
    })
  );

test('les champs proposés au modèle : ni cachés, ni llm:false, ni pickers ; libellés uniques', () => {
  const names = fieldsForNatural(catalog()).map(f => f.name);
  expect(names).not.toContain('donations.lang.lang_id');
  expect(names).not.toContain('donations.grp_id');
  expect(names).not.toContain('cause.cau_id');
  expect(names).toContain('don_kind');
  const twice = normalizeCatalog([{ name: 'a', label: 'Nom', type: 'text' }, { name: 'b', label: 'Nom', type: 'text' }, { name: 'c', label: 'Cause', type: 'picker', llm: true }]);
  expect(fieldsForNatural(twice).map(f => f.name)).toEqual(['a', 'c']);
  const json = catalogToJson(catalog());
  expect(json.find(f => f.name === 'last_donation.don_real_ts').description).toBe('date du dernier paiement reçu');
  expect(json.find(f => f.name === 'donations.grp_id').llm).toBe(false);
  expect(json.find(f => f.name === 'donations.lang.lang_id').hidden).toBe(true);
  expect(json.find(f => f.name === 'cli_lastname').llm).toBeUndefined();
});

test('le prompt : une ligne par champ avec type, choix et description ; la date du jour ; les exemples', () => {
  const prompt = buildNaturalPrompt(catalog(), {
    today: '2026-10-19',
    subject: 'la liste des donateurs',
    examples: [
      { phrase: 'particuliers par chèque', criteria: [{ name: 'client_category.clic_id', operator: 'eq', values: ['Particulier'] }, { name: 'donations.payment_type.ptyp_id', operator: 'eq', values: ['Chèque'] }] },
      { phrase: 'sans e-mail, membres du club', criteria: [{ name: 'cli_email', operator: 'empty', values: [] }], unmatched: ['membres du club'] },
    ],
  });
  expect(prompt).toContain('critères de recherche sur la liste des donateurs.');
  expect(prompt).toContain('- Catégorie : select [Administration | Entreprise | Particulier]');
  expect(prompt).toContain('- Don : select [Tous | Régulier | Ponctuel]');
  expect(prompt).toContain('- Dernier paiement : date — date du dernier paiement reçu');
  expect(prompt).toContain('- Montant : monetary');
  expect(prompt).not.toContain('Association');
  expect(prompt).not.toContain('Langue');
  expect(prompt).toContain("Aujourd'hui : 2026-10-19.");
  expect(prompt).toContain('Demande : « particuliers par chèque »\n{"mode":"AND","c":[{"f":"Catégorie","o":"eq","v":["Particulier"]},{"f":"Moyen de paiement","o":"eq","v":["Chèque"]}],"unmatched":[]}');
  expect(prompt).toContain('{"f":"E-mail","o":"empty","v":[]}],"unmatched":["membres du club"]}');
  expect(buildNaturalPrompt(catalog(), { today: new Date(Date.UTC(2026, 0, 5)) })).toContain("Aujourd'hui : 2026-01-05.");
});

test('le schéma impose les libellés et la matrice des opérateurs ; la requête est complète', () => {
  const schema = buildNaturalSchema(catalog());
  expect(schema.properties.c.items.properties.f.enum).toEqual(fieldsForNatural(catalog()).map(f => f.label));
  expect(schema.properties.c.items.properties.o.enum).toEqual(expect.arrayContaining(['contains', 'containsb', 'eq', 'between', 'ltwe', 'empty']));
  expect(schema.required).toEqual(['mode', 'c', 'unmatched']);
  const request = buildNaturalRequest('réguliers par chèque', catalog(), { today: '2026-10-19' });
  expect(Object.keys(request).sort()).toEqual(['format', 'phrase', 'system', 'user']);
  expect(request.user).toBe('Demande : « réguliers par chèque »');
  expect(request.format).toEqual(schema);
});

test('la réponse se lit en objet, en JSON ou dans une clôture markdown', () => {
  expect(parseNaturalContent({ mode: 'AND', c: [] })).toEqual({ mode: 'AND', c: [] });
  expect(parseNaturalContent('{"mode":"OR","c":[],"unmatched":[]}').mode).toBe('OR');
  expect(parseNaturalContent('```json\n{"mode":"AND","c":[]}\n```').mode).toBe('AND');
  expect(() => parseNaturalContent('pas du json')).toThrow();
});

test('les valeurs de choix se rapprochent des options : exacte, sans accent ni casse, préfixe unique, sinon rien', () => {
  const field = normalizeCatalog([{ name: 'x', label: 'X', type: 'select', options: [{ value: 2, label: 'Association / Fondation' }, { value: 4, label: 'Entreprise' }, { value: 6, label: 'École' }] }])[0];
  expect(matchOption(field, '4').value).toBe(4);
  expect(matchOption(field, 'entreprise').value).toBe(4);
  expect(matchOption(field, 'Ecole').value).toBe(6);
  expect(matchOption(field, 'Association').value).toBe(2);
  expect(matchOption(field, 'Fondation').value).toBe(2);
  expect(matchOption(field, 'E')).toBeNull();
  expect(matchOption(field, 'Zoo')).toBeNull();
});

test('la réponse courte devient des critères vérifiés : champs par libellé, options en valeurs, dates et nombres normalisés', () => {
  const raw = {
    mode: 'AND',
    c: [
      { f: 'Catégorie', o: 'eq', v: ['Entreprise', 'Association'] },
      { f: 'Ville', o: 'contains', v: ['Lyon'] },
      { f: 'Montant', o: 'gte', v: ['1 500,50 €'] },
      { f: 'Paiement', o: 'between', v: ['2024-01-01', '31/12/2024'] },
      { f: 'Don', o: 'eq', v: ['Régulier'] },
      { f: 'Reçu fiscal', o: 'eq', v: ['oui'] },
    ],
    unmatched: [],
  };
  const result = naturalToCriteria(raw, catalog());
  expect(result.mode).toBe(FILTER_MODE_AND);
  expect(result.criteria.map(c => [c.name, c.operator, c.values])).toEqual([
    ['client_category.clic_id', 'eq', ['4']],
    ['cli_town', 'contains', ['Lyon']],
    ['donations.don_mnt_input', 'gte', ['1500.50']],
    ['donations.don_real_ts', 'between', ['2024-01-01', '2024-12-31']],
    ['don_kind', 'eq', ['regular']],
    ['cli_receipt', 'eq', ['1']],
  ]);
  expect(result.warnings).toEqual(['Catégorie : valeur « Association » inconnue, ignorée']);
  expect(result.criteria.every(c => /^crit-\d+$/.test(c.id))).toBe(true);
});

test('ce qui est corrigé ou ignoré est dit : champ inconnu, opérateur hors type, date fausse, plage incomplète, doublons, texte à une valeur', () => {
  const raw = {
    mode: 'OR',
    c: [
      { f: 'Âge', o: 'gt', v: ['40'] },
      { f: 'Moyen de paiement', o: 'containsb', v: ['CB'] },
      { f: 'Moyen de paiement', o: 'eq', v: ['Chèque'] },
      { f: 'Paiement', o: 'gte', v: ['2025-02-30'] },
      { f: 'Ami', o: 'between', v: ['2023-01-01'] },
      { f: 'Ami', o: 'contains', v: ['parraines', 'Kiki'] },
      { f: 'Montant', o: 'gt', v: ['abc'] },
      { f: 'Montant', o: 'between', v: ['50', 'cent'] },
      { f: 'Nom', o: 'contains', v: ['Dupont'] },
      { f: 'Nom', o: 'contains', v: ['Durand'] },
      { f: 'Nom', o: 'containsb', v: ['Du'] },
      { f: 'E-mail', o: 'empty', v: ['x'] },
      { f: 'Montant', o: 'gt', v: [] },
    ],
    unmatched: ['quarante ans', ' '],
  };
  const result = naturalToCriteria(raw, catalog());
  expect(result.criteria.map(c => [c.name, c.operator, c.values])).toEqual([
    ['donations.payment_type.ptyp_id', 'eq', ['3', '5']],
    ['cli_lastname', 'contains', ['Dupont']],
    ['cli_email', 'empty', []],
  ]);
  expect(result.warnings).toEqual([
    'Champ inconnu « Âge », critère ignoré',
    'Moyen de paiement : « commence par » remplacé par « est »',
    'Paiement attend une date, pas « 2025-02-30 » : critère ignoré',
    'Ami : il faut un début et une fin, critère ignoré',
    'Ami attend une date, pas « parraines Kiki » : critère ignoré',
    'Montant attend un montant, pas « abc » : critère ignoré',
    'Montant : valeur « cent » inconnue, ignorée',
    'Montant : il faut un début et une fin, critère ignoré',
    'Montant : pas de valeur donnée, critère ignoré',
    'Nom : un seul critère retenu',
    'Nom : une seule valeur retenue, « Dupont »',
  ]);
  expect(result.unmatched).toEqual(['quarante ans']);
  expect(result.mode).toBe(FILTER_MODE_OR);
  const alone = naturalToCriteria({ mode: 'OR', c: [{ f: 'Nom', o: 'contains', v: ['a'] }] }, catalog());
  expect(alone.mode).toBe(FILTER_MODE_AND);
});

test('Pays « eq » à deux valeurs reste une liste ; une borne basse et une haute deviennent une plage', () => {
  const raw = {
    c: [
      { f: 'Pays', o: 'eq', v: ['Belgique'] },
      { f: 'Pays', o: 'eq', v: ['Suisse'] },
      { f: 'Montant', o: 'gte', v: ['50'] },
      { f: 'Montant', o: 'ltwe', v: ['500'] },
      { f: 'Dernier paiement', o: 'ltw', v: ['2025-10-19'] },
      { f: 'Dernier paiement', o: 'gt', v: ['2024-01-01'] },
    ],
  };
  const withCountry = normalizeCatalog(catalog().concat([{ name: 'country.cnty_name', label: 'Pays', type: 'text' }]));
  const result = naturalToCriteria(raw, withCountry);
  expect(result.criteria.map(c => [c.name, c.operator, c.values])).toEqual([
    ['country.cnty_name', 'eq', ['Belgique', 'Suisse']],
    ['donations.don_mnt_input', 'between', ['50', '500']],
    ['last_donation.don_real_ts', 'between', ['2024-01-01', '2025-10-19']],
  ]);
  expect(result.warnings).toEqual([]);
});

test('avec la demande : une valeur texte qui n’y figure pas a été inventée et part ; accents et casse ignorés', () => {
  const raw = {
    c: [
      { f: 'Don', o: 'eq', v: ['Ponctuel'] },
      { f: 'E-mail', o: 'empty', v: [] },
      { f: 'Ville', o: 'contains', v: ['United Kingdom'] },
      { f: 'Nom', o: 'containsb', v: ['Dup'] },
      { f: 'Ville', o: 'eq', v: ['Strasbourg'] },
    ],
    unmatched: ['en anglais'],
  };
  const result = naturalToCriteria(raw, catalog(), { phrase: 'ponctuels sans e-mail, en anglais, nom DUP, à STRASBOURG' });
  expect(result.criteria.map(c => [c.name, c.operator, c.values])).toEqual([
    ['don_kind', 'eq', ['once']],
    ['cli_email', 'empty', []],
    ['cli_lastname', 'containsb', ['Dup']],
    ['cli_town', 'eq', ['Strasbourg']],
  ]);
  expect(result.warnings).toEqual(['Ville : « United Kingdom » n’est pas dans la demande, ignoré']);
  const free = naturalToCriteria({ c: [{ f: 'Ville', o: 'contains', v: ['Lyon'] }] }, catalog());
  expect(free.criteria.length).toBe(1);
});

test('des comparaisons sur un texte (« Paris et banlieue » en codes postaux) : une ligne par champ, le reste tient', () => {
  const raw = {
    c: [
      { f: 'Ville', o: 'between', v: ['75000', '75019'] },
      { f: 'Ville', o: 'gt', v: ['75020'] },
      { f: 'Ville', o: 'ltwe', v: ['91999'] },
      { f: 'Nom', o: 'gte', v: ['M'] },
      { f: 'Paiement', o: 'between', v: ['2026-01-01', '2026-12-31'] },
    ],
  };
  const result = naturalToCriteria(raw, catalog(), { phrase: 'paris et banlieue, don en 2026' });
  expect(result.criteria.map(c => [c.name, c.operator, c.values])).toEqual([['donations.don_real_ts', 'between', ['2026-01-01', '2026-12-31']]]);
  expect(result.warnings).toEqual([
    'Ville : « 75000 à 75019 », « 75020 », « 91999 » ignoré — un texte ne se compare pas, il « commence par » ou « contient »',
    'Nom : « M » ignoré — un texte ne se compare pas, il « commence par » ou « contient »',
  ]);
  expect(buildNaturalPrompt(catalog())).toContain('Un champ text ne se compare pas');
});

test('la forme pleine { criteria: [{ field, operator, values }] } est acceptée, par nom comme par libellé', () => {
  const result = naturalToCriteria({ criteria: [{ field: 'cli_town', operator: 'containsb', values: 'Stras' }, { field: 'Nom', operator: 'contains', values: ['Dup'] }] }, catalog());
  expect(result.criteria.map(c => [c.name, c.operator, c.values])).toEqual([['cli_town', 'containsb', ['Stras']], ['cli_lastname', 'contains', ['Dup']]]);
});

test('le résultat complet : Filter bâti sur la base, non compris en tête des avertissements, phrase en clair relisible', () => {
  const base = new Filter();
  base.init(FILTER_MODE_AND, FILTER_OPER_LIKE);
  base.addFilter('group.id', 15, FILTER_OPER_EQUAL, true);
  base.addFilter('cli_town', 'Paris', FILTER_OPER_LIKE);
  ['cli_firstname', 'cli_lastname'].forEach(n => base.addFilter(n, 'dup', FILTER_OPER_LIKE, false, false, true, 'quick'));
  const raw = { mode: 'AND', c: [{ f: 'Don', o: 'eq', v: ['Régulier'] }, { f: 'Moyen de paiement', o: 'eq', v: ['CB', 'Chèque', 'Prélèvement'] }], unmatched: ['en anglais'] };
  const result = naturalToResult(raw, catalog(), { base });
  expect(result.warnings).toEqual(['Non compris : « en anglais »']);
  expect(result.unmatched).toEqual(['en anglais']);
  expect(api(result.filter)).toEqual({
    filter: {
      and: {
        'group.id': { eq: '15' },
        'donations.sponsorship.spo_id': { nempty: null },
        'donations.payment_type.ptyp_id': { eq: '3,5,14' },
        or: { cli_firstname: { contains: 'dup' }, cli_lastname: { contains: 'dup' } },
      },
    },
  });
  /* La phrase relit aussi la recherche rapide conservée (groupe « quick »). */
  expect(filterToSentence(result.filter, catalog(), { subject: 'Résultats' })).toContain('réguliers, par cb, chèque ou prélèvement.');
  expect(base.findFirst('cli_town')).toBeTruthy();
});

test('createNaturalLanguage : transport appelé avec la requête, réponse relue, base prise dans le contexte', async () => {
  const transport = jest.fn(() => Promise.resolve({ content: '{"mode":"AND","c":[{"f":"Catégorie","o":"eq","v":["Particulier"]}],"unmatched":[]}' }));
  const onNaturalLanguage = createNaturalLanguage({ transport, catalog: () => catalog(), subject: 'la liste des donateurs', today: '2026-10-19' });
  const current = new Filter();
  current.init(FILTER_MODE_AND, FILTER_OPER_LIKE);
  current.addFilter('group.id', 15, FILTER_OPER_EQUAL, true);
  current.addFilter('cli_lastname', 'x', FILTER_OPER_LIKE);
  const result = await onNaturalLanguage('les particuliers', { filter: current, locale: 'fr' });
  expect(transport).toHaveBeenCalledTimes(1);
  const [request, context] = transport.mock.calls[0];
  expect(request.phrase).toBe('les particuliers');
  const invented = createNaturalLanguage({ transport: () => '{"mode":"AND","c":[{"f":"Ville","o":"contains","v":["Londres"]}],"unmatched":["en anglais"]}', catalog: catalog() });
  const checked = await invented('donateurs en anglais');
  expect(checked.criteria).toEqual([]);
  expect(checked.warnings[0]).toBe('Non compris : « en anglais »');
  expect(checked.warnings[1]).toBe('Ville : « Londres » n’est pas dans la demande, ignoré');
  expect(request.system).toContain('la liste des donateurs');
  expect(context.locale).toBe('fr');
  expect(api(result.filter)).toEqual({ filter: { and: { 'group.id': { eq: '15' }, 'client_category.clic_id': { eq: '6' } } } });
  expect(result.criteria).toEqual([{ id: expect.any(String), name: 'client_category.clic_id', operator: 'eq', values: ['6'] }]);
  const raw = createNaturalLanguage({ transport: () => '{"mode":"AND","c":[],"unmatched":[]}', catalog: catalog() });
  const empty = await raw('rien');
  expect(empty.criteria).toEqual([]);
  expect(empty.warnings).toEqual([]);
  await expect(createNaturalLanguage({ transport: () => 'nope', catalog: catalog() })('x')).rejects.toBeInstanceOf(Error);
  expect(() => createNaturalLanguage({ catalog: catalog() })).toThrow();
});
