/**
 * Tests dorés de `asJsonApiObject()`.
 *
 * Ils figent la sortie du modèle telle que les applications l'envoient à l'API
 * aujourd'hui, avant les évolutions de la recherche (voir
 * doc/recherche/etude.md, section 7). Toute évolution du modèle doit les laisser
 * verts : la forme envoyée à l'API ne change pas pour un filtre sans groupe.
 *
 * Le modèle construit ses critères dans un tableau utilisé comme dictionnaire
 * (`crits2 = []`) : `normalize` ramène tout à des objets simples, pour comparer
 * ce que lit réellement `objectToQueryString` (les clés), pas le type du conteneur.
 */
import {
  Filter,
  FILTER_MODE_AND,
  FILTER_MODE_OR,
  FILTER_OPER_LIKE,
  FILTER_OPER_SOUND_LIKE,
  FILTER_OPER_EQUAL,
  FILTER_OPER_EMPTY,
  FILTER_OPER_NOT_EMPTY,
  FILTER_OPER_BETWEEN,
  FILTER_OPER_GREATER_OR_EQUAL,
  FILTER_OPER_GREATER_OR_EQUAL_OR_NULL,
} from '../../../src/features/filter';

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

test('filtre vide : aucun paramètre', () => {
  const f = new Filter();
  f.init(FILTER_MODE_AND, FILTER_OPER_LIKE);
  expect(api(f)).toEqual({});
});

test('mode ET, deux critères texte (panneau de filtres)', () => {
  const f = new Filter();
  f.init(FILTER_MODE_AND, FILTER_OPER_LIKE);
  f.addFilter('cli_lastname', 'Dupont', FILTER_OPER_LIKE);
  f.addFilter('cli_town', 'Metz', FILTER_OPER_LIKE);
  expect(api(f)).toEqual({
    filter: { and: { cli_lastname: { contains: 'Dupont' }, cli_town: { contains: 'Metz' } } },
  });
});

test('mode OU : la recherche rapide sur quatre champs', () => {
  const f = new Filter();
  f.init(FILTER_MODE_OR, FILTER_OPER_LIKE);
  ['cli_firstname', 'cli_lastname', 'cli_email', 'cli_email_2'].forEach(name => {
    f.addFilter(name, 'dup', FILTER_OPER_LIKE);
  });
  expect(api(f)).toEqual({
    filter: {
      and: {
        or: {
          cli_firstname: { contains: 'dup' },
          cli_lastname: { contains: 'dup' },
          cli_email: { contains: 'dup' },
          cli_email_2: { contains: 'dup' },
        },
      },
    },
  });
});

/* Les valeurs sortent toujours en chaînes : le modèle les concatène. */
test('mode OU avec un critère fixe : le fixe sort du « or »', () => {
  const f = new Filter();
  f.init(FILTER_MODE_OR, FILTER_OPER_SOUND_LIKE);
  f.addFilter('group.id', 15, FILTER_OPER_EQUAL, true);
  f.addFilter('client.cli_lastname', 'dupon', FILTER_OPER_SOUND_LIKE);
  expect(api(f)).toEqual({
    filter: {
      and: { or: { 'client.cli_lastname': { soundex: 'dupon' } } },
      'group.id': { eq: '15' },
    },
  });
});

test('mode ET avec un critère fixe : tout dans « and »', () => {
  const f = new Filter();
  f.init(FILTER_MODE_AND, FILTER_OPER_LIKE);
  f.addFilter('group.id', 15, FILTER_OPER_EQUAL, true);
  f.addFilter('cli_town', 'Metz', FILTER_OPER_LIKE);
  expect(api(f)).toEqual({
    filter: { and: { cli_town: { contains: 'Metz' }, 'group.id': { eq: '15' } } },
  });
});

test('entre deux bornes : un tableau de deux valeurs', () => {
  const f = new Filter();
  f.init(FILTER_MODE_AND, FILTER_OPER_LIKE);
  f.addFilter('donations.don_real_ts', '2025-01-01', FILTER_OPER_BETWEEN);
  f.updateFilter('donations.don_real_ts', '2025-12-31', 'between');
  expect(api(f)).toEqual({
    filter: { and: { 'donations.don_real_ts': { between: ['2025-01-01', '2025-12-31'] } } },
  });
});

test('vide et non vide : la valeur est nulle', () => {
  const f = new Filter();
  f.init(FILTER_MODE_AND, FILTER_OPER_LIKE);
  f.addFilter('cli_email', null, FILTER_OPER_EMPTY);
  f.addFilter('donations.sponsorship.spo_id', null, FILTER_OPER_NOT_EMPTY);
  expect(api(f)).toEqual({
    filter: { and: { cli_email: { empty: null }, 'donations.sponsorship.spo_id': { nempty: null } } },
  });
});

test('plusieurs valeurs d’un même champ : jointes par des virgules', () => {
  const f = new Filter();
  f.init(FILTER_MODE_AND, FILTER_OPER_LIKE);
  f.addFilter('client_category.clic_id', 1, FILTER_OPER_EQUAL);
  f.updateFilter('client_category.clic_id', 3, 'abcd1234');
  f.updateFilter('client_category.clic_id', 5, 'efgh5678');
  expect(api(f)).toEqual({
    filter: { and: { 'client_category.clic_id': { eq: '1,3,5' } } },
  });
});

test('critère par défaut désactivé : absent de la requête', () => {
  const f = new Filter();
  f.init(FILTER_MODE_AND, FILTER_OPER_LIKE);
  f.addFilter('cau_to', '2026-01-01', FILTER_OPER_GREATER_OR_EQUAL_OR_NULL, false, true);
  f.addFilter('cau_name', 'Lulu', FILTER_OPER_LIKE);
  expect(api(f)).toEqual({
    filter: { and: { cau_name: { contains: 'Lulu' }, cau_to: { gten: '2026-01-01' } } },
  });
  f.disableDefaults();
  expect(api(f)).toEqual({ filter: { and: { cau_name: { contains: 'Lulu' } } } });
  f.enableDefaults();
  expect(api(f)).toEqual({
    filter: { and: { cau_name: { contains: 'Lulu' }, cau_to: { gten: '2026-01-01' } } },
  });
});

test('une seule borne : opérateur simple, pas de tableau', () => {
  const f = new Filter();
  f.init(FILTER_MODE_AND, FILTER_OPER_LIKE);
  f.addFilter('donations.don_mnt_input', 100, FILTER_OPER_GREATER_OR_EQUAL);
  expect(api(f)).toEqual({
    filter: { and: { 'donations.don_mnt_input': { gte: '100' } } },
  });
});

test('une valeur vide ne crée pas de critère', () => {
  const f = new Filter();
  f.init(FILTER_MODE_AND, FILTER_OPER_LIKE);
  f.addFilter('cli_town', '', FILTER_OPER_LIKE);
  expect(f.data.filters.length).toBe(0);
  expect(api(f)).toEqual({});
});
