import { Filter, FILTER_MODE_AND, FILTER_MODE_OR, FILTER_OPER_LIKE, FILTER_OPER_EMPTY, FILTER_OPER_START_WITH, FILTER_OPER_EQUAL, FILTER_OPER_GREATER_OR_EQUAL } from '../../../src/features/filter';
import { filterToSentence, filterToSentenceParts, filterToFragments, formatDate, formatAmount, renderTemplate, valuesToFilter } from '../../../src/features/search';
import { donorCatalog } from './fixtures';

const fresh = () => {
  const f = new Filter();
  f.init(FILTER_MODE_AND, FILTER_OPER_LIKE);
  return f;
};

test('maquette 1 : la phrase du tiroir, mot pour mot', () => {
  const catalog = donorCatalog();
  const f = fresh();
  f.setFilterRange('last_donation.don_real_ts', '2025-01-01', '2025-12-31');
  f.replaceFilter('donations.grp_id', [15], FILTER_OPER_EQUAL);
  f.replaceFilter('cli_town', ['…'], FILTER_OPER_START_WITH);
  f.replaceFilter('cli_email', [], FILTER_OPER_EMPTY);
  expect(filterToSentence(f, catalog, undefined, { subject: 'Donateurs' })).toBe(
    'Donateurs dont le dernier paiement est entre le 01/01/2025 et le 31/12/2025, rattachés à Kalaweit France, dont la ville commence par …, sans e-mail.'
  );
});

test('maquette 3 : la phrase du pied de la fiche, mot pour mot, depuis les valeurs', () => {
  const catalog = donorCatalog();
  const f = valuesToFilter(
    {
      'client_category.clic_id': [6],
      'donations.don_real_ts': ['2025-01-01', '2025-12-31'],
      'donations.payment_type.ptyp_id': [5],
      'donations.cause.cause_type.caut_id': [11],
    },
    catalog
  );
  expect(filterToSentence(f, catalog, undefined, { subject: 'Donateurs' })).toBe(
    'Particuliers ayant payé entre le 01/01/2025 et le 31/12/2025, par chèque, pour le programme Forêt.'
  );
});

test('les valeurs sont en gras, le sujet aussi', () => {
  const catalog = donorCatalog();
  const f = fresh();
  f.setFilterRange('donations.don_real_ts', '2025-01-01', '2025-12-31');
  const parts = filterToSentenceParts(f, catalog, undefined, { subject: 'Donateurs' });
  expect(parts.filter(p => p.bold).map(p => p.text)).toEqual(['Donateurs', '01/01/2025', '31/12/2025']);
  expect(parts[0].subject).toBe(true);
});

test('plusieurs valeurs : « A, B ou C » ; champ virtuel ; sujet par défaut', () => {
  const catalog = donorCatalog();
  const f = valuesToFilter({ 'donations.payment_type.ptyp_id': [3, 5, 14], don_kind: 'regular' }, catalog);
  /* Les fragments suivent l'ordre du catalogue : le virtuel « Don » y précède les moyens. */
  expect(filterToSentence(f, catalog)).toBe('Résultats réguliers, par cb, chèque ou prélèvement.');
});

test('un groupe de critères identiques se dit en une fois', () => {
  const catalog = donorCatalog();
  const f = fresh();
  f.replaceFilter('cli_town', ['Metz'], FILTER_OPER_START_WITH);
  ['cli_lastname', 'cli_email'].forEach(name => f.addFilter(name, 'dup', FILTER_OPER_LIKE, false, false, true, 'quick'));
  expect(filterToSentence(f, catalog, undefined, { subject: 'Donateurs' })).toBe(
    'Donateurs dont la ville commence par Metz, dont le nom ou l’e-mail contient dup.'
  );
  /* Des valeurs différentes dans le groupe : chacun son fragment. */
  const g = fresh();
  g.addFilter('cli_lastname', 'a', FILTER_OPER_LIKE, false, false, true, 'quick');
  g.addFilter('cli_email', 'b', FILTER_OPER_LIKE, false, false, true, 'quick');
  expect(filterToSentence(g, catalog, undefined, { subject: 'Donateurs' })).toBe('Donateurs dont le nom contient a, dont l’e-mail contient b.');
});

test('mode OU : « ou » avant le dernier fragment', () => {
  const catalog = donorCatalog();
  const f = new Filter();
  f.init(FILTER_MODE_OR, FILTER_OPER_LIKE);
  f.addFilter('cli_lastname', 'dup', FILTER_OPER_LIKE);
  f.addFilter('cli_town', 'dup', FILTER_OPER_LIKE);
  expect(filterToSentence(f, catalog, undefined, { subject: 'Donateurs' })).toBe('Donateurs dont le nom contient dup ou dont la ville contient dup.');
});

test('une seule borne, montant, booléen, champ hors catalogue, fixes ignorés', () => {
  const catalog = donorCatalog();
  const f = fresh();
  f.addFilter('group.id', 15, FILTER_OPER_EQUAL, true);
  f.setFilterRange('donations.don_mnt_input', 100, null);
  f.replaceFilter('cli_receipt', ['1'], FILTER_OPER_EQUAL);
  f.replaceFilter('inconnu', ['x'], FILTER_OPER_EQUAL);
  expect(f.findFirst('donations.don_mnt_input').getOperator()).toBe(FILTER_OPER_GREATER_OR_EQUAL);
  expect(filterToSentence(f, catalog, undefined, { subject: 'Donateurs' })).toBe(
    'Donateurs dont montant est supérieur ou égal à 100 €, dont le reçu fiscal est oui, inconnu eq x.'
  );
});

test('sans critère : null et chaîne vide', () => {
  const catalog = donorCatalog();
  const f = fresh();
  f.addFilter('group.id', 15, FILTER_OPER_EQUAL, true);
  expect(filterToSentenceParts(f, catalog)).toBeNull();
  expect(filterToSentence(f, catalog)).toBe('');
  expect(filterToFragments(f, catalog)).toEqual([]);
});

test('les gabarits passent par t, jetons préservés', () => {
  const catalog = donorCatalog();
  const f = fresh();
  f.replaceFilter('cli_email', [], FILTER_OPER_EMPTY);
  const t = (desc, values) => {
    if (desc.id === 'rbf.search.phrase.empty') {
      return `without ${values.label}`;
    }
    return desc.defaultMessage;
  };
  expect(filterToSentence(f, catalog, t, { subject: 'Donors' })).toBe('Donors without e-mail.');
});

test('formats et gabarits', () => {
  expect(formatDate('2025-03-07')).toBe('07/03/2025');
  expect(formatDate(new Date(2025, 11, 31))).toBe('31/12/2025');
  expect(formatDate('')).toBe('');
  expect(formatAmount('12.5')).toBe('12,5 €');
  expect(formatAmount(100, 'CHF')).toBe('100 CHF');
  expect(formatAmount('abc')).toBe('abc');
  expect(renderTemplate('dont {label} est entre le {from} et le {to}', { label: 'la date', from: 'A', to: 'B' })).toEqual([
    { text: 'dont ' }, { text: 'la date' }, { text: ' est entre le ' }, { text: 'A', bold: true }, { text: ' et le ' }, { text: 'B', bold: true },
  ]);
});
