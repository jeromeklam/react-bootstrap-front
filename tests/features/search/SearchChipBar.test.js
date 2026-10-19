import React from 'react';
import { shallow } from 'enzyme';
import { Chip } from '../../../src/features/basic';
import { Filter, FILTER_MODE_AND, FILTER_OPER_LIKE, FILTER_OPER_EQUAL, FILTER_OPER_EMPTY } from '../../../src/features/filter';
import { SearchChipBar, FacetPopover } from '../../../src/features/search';
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
const api = f => normalize(f.asJsonApiObject());

const filterWith = () => {
  const f = new Filter();
  f.init(FILTER_MODE_AND, FILTER_OPER_LIKE);
  f.addFilter('group.id', 15, FILTER_OPER_EQUAL, true);
  f.replaceFilter('cli_town', ['Metz'], 'containsb');
  f.setFilterValues('donations.payment_type.ptyp_id', [5, 14]);
  f.setFilterRange('last_donation.don_real_ts', '2025-01-01', '2025-12-31');
  f.replaceFilter('cli_email', [], FILTER_OPER_EMPTY);
  f.replaceFilter('donations.sponsorship.spo_id', [], 'nempty');
  ['cli_firstname', 'cli_lastname'].forEach(name => f.addFilter(name, 'dup', FILTER_OPER_LIKE, false, false, true, 'quick'));
  return f;
};
const icons = { close: <i className="x" />, caret: <i className="v" />, add: <i className="plus" /> };
const labels = w => w.find(Chip).map(c => (typeof c.prop('label') === 'string' ? c.prop('label') : '(nœud)'));

test('pastilles actives, facettes avec compteur, recherche rapide groupée, + Critère', () => {
  const w = shallow(<SearchChipBar filter={filterWith()} catalog={donorCatalog()} onChange={() => {}} icons={icons} onAddCriterion={() => {}} />);
  expect(labels(w)).toEqual([
    'Recherche : dup',
    'Ville : Metz',
    'E-mail : vide',
    'Don : réguliers',
    'Moyen de paiement',
    'Dernier paiement',
    '(nœud)',
  ]);
  const facets = w.find(Chip).filterWhere(c => c.prop('variant') === 'facet');
  expect(facets.map(c => c.prop('count'))).toEqual([2, 2]);
  expect(w.find('.rbf-chip-bar-clear').length).toBe(1);
});

test('× rend un nouveau filtre sans le critère, l’original intact ; le virtuel passe par toFilter', () => {
  const onChange = jest.fn();
  const original = filterWith();
  const w = shallow(<SearchChipBar filter={original} catalog={donorCatalog()} onChange={onChange} icons={icons} />);
  w.find(Chip).filterWhere(c => c.prop('label') === 'Ville : Metz').prop('onRemove')();
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange.mock.calls[0][0].hasFilter('cli_town')).toBe(false);
  expect(original.hasFilter('cli_town')).toBe(true);
  w.find(Chip).filterWhere(c => c.prop('label') === 'Don : réguliers').prop('onRemove')();
  expect(onChange.mock.calls[1][0].hasFilter('donations.sponsorship.spo_id')).toBe(false);
  w.find(Chip).filterWhere(c => c.prop('label') === 'Recherche : dup').prop('onRemove')();
  expect(onChange.mock.calls[2][0].getFilters({ group: 'quick' }).length).toBe(0);
  expect(onChange.mock.calls[2][0].hasFilter('cli_town')).toBe(true);
});

test('une facette ouvre son menu ; Appliquer écrit les valeurs ; Tout effacer garde les fixes', () => {
  const onChange = jest.fn();
  const w = shallow(<SearchChipBar filter={filterWith()} catalog={donorCatalog()} onChange={onChange} icons={icons} />);
  expect(w.find(FacetPopover).length).toBe(0);
  w.find(Chip).filterWhere(c => c.prop('label') === 'Moyen de paiement').prop('onClick')();
  const popover = w.find(FacetPopover);
  expect(popover.length).toBe(1);
  expect(popover.prop('value')).toEqual([5, 14]);
  popover.prop('onApply')([3]);
  expect(api(onChange.mock.calls[0][0]).filter.and['donations.payment_type.ptyp_id']).toEqual({ eq: '3' });
  expect(w.find(FacetPopover).length).toBe(0);
  w.find(Chip).filterWhere(c => c.prop('label') === 'Dernier paiement').prop('onClick')();
  expect(w.find(FacetPopover).prop('value')).toEqual(['2025-01-01', '2025-12-31']);
  w.find(FacetPopover).prop('onApply')(['2025-06-01', '']);
  expect(api(onChange.mock.calls[1][0]).filter.and['last_donation.don_real_ts']).toEqual({ gte: '2025-06-01' });
  w.find('.rbf-chip-bar-clear').simulate('click');
  const cleared = onChange.mock.calls[2][0];
  expect(cleared.isEmpty()).toBe(true);
  expect(cleared.hasFilter('group.id')).toBe(true);
});

test('filtre vide : seulement les facettes, pas de « Tout effacer »', () => {
  const f = new Filter();
  f.init(FILTER_MODE_AND, FILTER_OPER_LIKE);
  const w = shallow(<SearchChipBar filter={f} catalog={donorCatalog()} onChange={() => {}} facets={['donations.payment_type.ptyp_id']} />);
  expect(labels(w)).toEqual(['Moyen de paiement']);
  expect(w.find('.rbf-chip-bar-clear').length).toBe(0);
});
