import {
  normalizeType,
  normalizeCatalog,
  catalogFromCols,
  findField,
  fieldOwning,
  fieldsForRows,
  fieldsForFacets,
  fieldsForSection,
  catalogToJson,
} from '../../../src/features/search';

/* Un extrait fidèle du getCols des donateurs d'admin, coquilles comprises. */
const COLS = [
  { name: 'lastname', label: 'Nom', col: 'cli_lastname', filterable: { type: 'text' } },
  { name: 'email', label: 'E-mail', col: 'cli_email', filterable: { type: 'test' } },
  { name: 'id', label: 'Identifiant', col: 'cli_id', filterable: false },
  { name: 'category', label: 'Catégorie', col: 'client_category.clic_id', filterable: { type: 'select', options: [{ value: 1, label: 'Particulier' }] } },
  { name: 'payment_types', label: '', col: 'donations.payment_type.ptyp_id', filterable: { type: 'select', options: [] } },
  { name: 'last', label: 'Dernier paiement', col: 'last_donation.don_real_ts', filterable: { type: 'date', col: 'last_donation.don_real_ts' } },
  { name: 'receipt', label: 'Reçu', col: 'cli_receipt', filterable: { type: 'boolean' } },
  { name: 'site', label: 'Refuge', col: 'site.site_id', filterable: { type: 'picker', display: 'site_name', onSearch: () => Promise.resolve([]) } },
  { name: 'dup', label: 'Doublon', col: 'cli_lastname', filterable: true },
];

let warn;
beforeEach(() => {
  warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
});
afterEach(() => warn.mockRestore());

test('normalizeType : alias tolérés, inconnu → texte', () => {
  expect(normalizeType('text')).toBe('text');
  expect(normalizeType('test')).toBe('text');
  expect(normalizeType('boolean')).toBe('bool');
  expect(normalizeType('MONETARY')).toBe('monetary');
  expect(normalizeType('bizarre')).toBe('text');
  expect(normalizeType(undefined)).toBe('text');
});

test('catalogFromCols : seulement les colonnes filtrables à libellé, nom = col', () => {
  const catalog = catalogFromCols(COLS);
  /* cli_lastname est déclaré deux fois : il garde sa place, le dernier contenu gagne. */
  expect(catalog.map(f => f.name)).toEqual([
    'cli_lastname',
    'cli_email',
    'client_category.clic_id',
    'last_donation.don_real_ts',
    'cli_receipt',
    'site.site_id',
  ]);
  expect(findField(catalog, 'cli_email').type).toBe('text');
  expect(findField(catalog, 'cli_receipt').type).toBe('bool');
  const cat = findField(catalog, 'client_category.clic_id');
  expect(cat.options.length).toBe(1);
  expect(cat.multiple).toBe(true);
  expect(cat.defaultOperator).toBe('eq');
  expect(findField(catalog, 'last_donation.don_real_ts').defaultOperator).toBe('between');
  const site = findField(catalog, 'site.site_id');
  expect(site.type).toBe('picker');
  expect(typeof site.picker.onSearch).toBe('function');
  expect(findField(catalog, 'cli_lastname').label).toBe('Doublon');
});

test('overrides : par nom, libellé pour une colonne sans libellé, champs extra', () => {
  const extra = {
    name: 'don_kind', virtual: true, label: 'Don', section: 'paiement', widget: 'segmented',
    fields: ['donations.sponsorship.spo_id'], toFilter: () => {}, fromFilter: () => '',
  };
  const catalog = catalogFromCols(COLS, {
    'donations.payment_type.ptyp_id': { label: 'Moyen de paiement', facet: { order: 10 }, section: 'moyen', widget: 'pills' },
    'client_category.clic_id': { facet: { order: 20 }, phrase: { eq: 'de catégorie {value}' } },
    'last_donation.don_real_ts': { label: 'Dernier paiement', facet: { order: 5, kind: 'range' } },
    extra: [extra],
  });
  expect(findField(catalog, 'donations.payment_type.ptyp_id').label).toBe('Moyen de paiement');
  expect(fieldsForFacets(catalog).map(f => f.name)).toEqual([
    'last_donation.don_real_ts',
    'donations.payment_type.ptyp_id',
    'client_category.clic_id',
  ]);
  expect(fieldsForSection(catalog, 'paiement').map(f => f.name)).toEqual(['don_kind']);
  expect(fieldOwning(catalog, 'donations.sponsorship.spo_id').name).toBe('don_kind');
  expect(fieldOwning(catalog, 'cli_email').name).toBe('cli_email');
  expect(fieldOwning(catalog, 'inconnu')).toBeUndefined();
});

test('fieldsForRows écarte les champs cachés', () => {
  const catalog = normalizeCatalog([
    { name: 'a', label: 'A', type: 'text' },
    { name: 'b', label: 'B', type: 'text', hidden: true },
  ]);
  expect(fieldsForRows(catalog).map(f => f.name)).toEqual(['a']);
});

test('normalizeCatalog : défauts, sans nom ignoré, un avertissement par problème', () => {
  const catalog = normalizeCatalog([{ name: 'x' }, { label: 'sans nom' }, { name: 'x', label: 'X2' }]);
  expect(catalog.length).toBe(1);
  expect(catalog[0]).toMatchObject({
    name: 'x', label: 'X2', type: 'text', defaultOperator: 'contains', multiple: false,
    multiOperator: 'eq', options: [], hidden: false, virtual: false, fields: [],
  });
  expect(warn.mock.calls.map(c => c[0])).toEqual(
    expect.arrayContaining([expect.stringContaining('sans nom'), expect.stringContaining('deux fois')])
  );
});

test('catalogToJson : aucune fonction, sérialisable', () => {
  const catalog = catalogFromCols(COLS, {
    extra: [{ name: 'v', virtual: true, label: 'V', fields: ['cli_email'], toFilter: () => {}, options: [{ value: 1, label: 'Un', format: () => '' }] }],
  });
  const json = catalogToJson(catalog);
  const text = JSON.stringify(json);
  expect(text).not.toContain('function');
  expect(JSON.parse(text).find(f => f.name === 'v')).toEqual({
    name: 'v', label: 'V', type: 'text', defaultOperator: 'contains', multiple: false,
    options: [{ value: 1, label: 'Un' }], virtual: true, fields: ['cli_email'],
  });
  expect(JSON.parse(text).find(f => f.name === 'site.site_id').picker).toBeUndefined();
});
