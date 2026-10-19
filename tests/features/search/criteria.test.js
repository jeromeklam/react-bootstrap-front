import { Filter, FILTER_MODE_AND, FILTER_MODE_OR, FILTER_OPER_LIKE, FILTER_OPER_EQUAL, FILTER_OPER_NOT_EMPTY } from '../../../src/features/filter';
import { valuesToFilter, filterToValues, isRangeField, isMultiField, hasValue } from '../../../src/features/search';
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

test('les valeurs de la fiche donnent la requête attendue', () => {
  const catalog = donorCatalog();
  const f = valuesToFilter(
    {
      cli_lastname: 'Dupont',
      cli_town: 'Me',
      'client_category.clic_id': [6, 4],
      'donations.don_real_ts': ['2025-01-01', '2025-12-31'],
      'donations.don_mnt_input': ['', '100'],
      don_kind: 'regular',
      'donations.payment_type.ptyp_id': [],
      cli_receipt: '1',
    },
    catalog
  );
  expect(f.getMode()).toBe(FILTER_MODE_AND);
  expect(api(f)).toEqual({
    filter: {
      and: {
        cli_lastname: { contains: 'Dupont' },
        cli_town: { containsb: 'Me' },
        'client_category.clic_id': { eq: '6,4' },
        'donations.don_real_ts': { between: ['2025-01-01', '2025-12-31'] },
        'donations.don_mnt_input': { ltwe: '100' },
        'donations.sponsorship.spo_id': { nempty: null },
        cli_receipt: { eq: '1' },
      },
    },
  });
});

test('base : les fixes et défauts restent, le reste est remplacé', () => {
  const catalog = donorCatalog();
  const base = new Filter();
  base.init(FILTER_MODE_AND, FILTER_OPER_LIKE);
  base.addFilter('group.id', 15, FILTER_OPER_EQUAL, true);
  base.addFilter('cli_town', 'Ancien', FILTER_OPER_LIKE);
  const f = valuesToFilter({ cli_lastname: 'Dupont' }, catalog, base);
  expect(api(f)).toEqual({ filter: { and: { cli_lastname: { contains: 'Dupont' }, 'group.id': { eq: '15' } } } });
  expect(base.hasFilter('cli_town')).toBe(true);
  const or = valuesToFilter({ cli_lastname: 'x' }, catalog, base, { mode: FILTER_MODE_OR });
  expect(or.getMode()).toBe(FILTER_MODE_OR);
});

test('aller-retour filtre → valeurs → filtre', () => {
  const catalog = donorCatalog();
  const values = {
    cli_lastname: 'Dupont',
    'client_category.clic_id': [6],
    'donations.don_real_ts': ['2025-01-01', '2025-12-31'],
    'donations.don_mnt_input': ['10', ''],
    'sponsorships.spo_ts': ['', '2024-06-30'],
    don_kind: 'once',
    'donations.payment_type.ptyp_id': [5, 14],
    'donations.grp_id': 15,
  };
  const f = valuesToFilter(values, catalog);
  const back = filterToValues(f, catalog);
  expect(back).toEqual(values);
  expect(api(valuesToFilter(back, catalog))).toEqual(api(f));
});

test('filterToValues : critère sans valeur ignoré, filtre absent', () => {
  const catalog = donorCatalog();
  const f = new Filter();
  f.init(FILTER_MODE_AND, FILTER_OPER_LIKE);
  f.replaceFilter('cli_email', [], 'empty');
  f.addFilter('donations.sponsorship.spo_id', null, FILTER_OPER_NOT_EMPTY);
  expect(filterToValues(f, catalog)).toEqual({ don_kind: 'regular' });
  expect(filterToValues(null, catalog)).toEqual({});
});

test('nature des champs et valeurs', () => {
  const catalog = donorCatalog();
  const byName = name => catalog.find(f => f.name === name);
  expect(isRangeField(byName('donations.don_real_ts'))).toBe(true);
  expect(isRangeField(byName('last_donation.don_real_ts'))).toBe(true);
  expect(isRangeField(byName('cli_town'))).toBe(false);
  expect(isMultiField(byName('client_category.clic_id'))).toBe(true);
  expect(isMultiField(byName('donations.grp_id'))).toBe(false);
  expect(hasValue(['', null])).toBe(false);
  expect(hasValue(['', '2025-01-01'])).toBe(true);
  expect(hasValue(0)).toBe(true);
  expect(hasValue('')).toBe(false);
});

describe('lignes du tiroir', () => {
  const { filterToCriteria, criteriaToFilter } = require('../../../src/features/search');

  const listFilter = () => {
    const f = new Filter();
    f.init(FILTER_MODE_AND, FILTER_OPER_LIKE);
    f.addFilter('group.id', 15, FILTER_OPER_EQUAL, true);
    f.addFilter('cau_to', '2026-01-01', 'gten', false, true);
    f.replaceFilter('cli_town', ['Me'], 'containsb');
    f.setFilterRange('last_donation.don_real_ts', '2025-01-01', '2025-12-31');
    f.replaceFilter('cli_email', [], 'empty');
    f.setFilterValues('donations.payment_type.ptyp_id', [5, 14]);
    f.addFilter('donations.sponsorship.spo_id', null, FILTER_OPER_NOT_EMPTY);
    ['cli_firstname', 'cli_lastname'].forEach(n => f.addFilter(n, 'dup', FILTER_OPER_LIKE, false, false, true, 'quick'));
    return f;
  };

  test('filterToCriteria : une ligne par critère éditable, le reste hors du tiroir', () => {
    const rows = filterToCriteria(listFilter(), donorCatalog());
    expect(rows.map(r => [r.name, r.operator, r.values])).toEqual([
      ['cli_town', 'containsb', ['Me']],
      ['last_donation.don_real_ts', 'between', ['2025-01-01', '2025-12-31']],
      ['cli_email', 'empty', []],
      ['donations.payment_type.ptyp_id', 'eq', [5, 14]],
      ['don_kind', 'eq', ['regular']],
    ]);
    expect(new Set(rows.map(r => r.id)).size).toBe(5);
  });

  test('criteriaToFilter : fixes, défauts et recherche rapide conservés, lignes appliquées', () => {
    const base = listFilter();
    const rows = filterToCriteria(base, donorCatalog());
    rows[0] = { ...rows[0], values: ['Metz'] };
    rows.push({ id: 'x', name: 'donations.grp_id', operator: 'eq', values: [16] });
    rows.push({ id: 'y', name: '', operator: 'eq', values: ['ignorée'] });
    rows.push({ id: 'z', name: 'cli_town', operator: 'eq', values: ['doublon ignoré'] });
    rows.push({ id: 'w', name: 'cli_lastname', operator: 'contains', values: ['', null] });
    const next = criteriaToFilter(rows, 'OR', donorCatalog(), base);
    expect(next).not.toBe(base);
    expect(base.findFirst('cli_town').getValues()).toEqual(['Me']);
    expect(next.getMode()).toBe('OR');
    expect(next.findFirst('group.id').isFixed()).toBe(true);
    expect(next.hasFilter('cau_to')).toBe(true);
    expect(next.getFilters({ group: 'quick' }).length).toBe(2);
    expect(next.findFirst('cli_town').getValues()).toEqual(['Metz']);
    expect(next.findFirst('cli_town').getOperator()).toBe('containsb');
    expect(next.findFirst('donations.grp_id').getValues()).toEqual([16]);
    expect(next.hasFilter('cli_lastname')).toBe(true);
    expect(next.findFirst('cli_lastname').getGroup()).toBe('quick');
  });

  test('criteriaToFilter : lignes retirées → critères retirés ; sans base → filtre neuf', () => {
    const base = listFilter();
    const next = criteriaToFilter([{ id: 'a', name: 'cli_email', operator: 'nempty', values: [] }], 'AND', donorCatalog(), base);
    expect(next.hasFilter('cli_town')).toBe(false);
    expect(next.hasFilter('donations.sponsorship.spo_id')).toBe(false);
    expect(next.findFirst('cli_email').getOperator()).toBe('nempty');
    expect(next.hasFilter('group.id')).toBe(true);
    const fresh = criteriaToFilter([{ id: 'b', name: 'don_kind', operator: 'eq', values: ['once'] }, { id: 'c', name: 'donations.don_mnt_input', operator: 'between', values: ['', '100'] }], 'AND', donorCatalog());
    expect(api(fresh)).toEqual({ filter: { and: { 'donations.sponsorship.spo_id': { empty: null }, 'donations.don_mnt_input': { ltwe: '100' } } } });
  });
});
