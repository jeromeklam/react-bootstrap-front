import React from 'react';
import { shallow } from 'enzyme';
import { Chip, InputSegmented } from '../../../src/features/basic';
import { Filter, FILTER_MODE_AND, FILTER_MODE_OR, FILTER_OPER_LIKE, FILTER_OPER_EQUAL } from '../../../src/features/filter';
import { Drawer } from '../../../src/features/advanced';
import { SearchCriteriaRow, SearchCriteriaBuilder, SearchDrawer, SearchFormField, SearchSummary, widgetForOperator } from '../../../src/features/search';
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
const byName = name => donorCatalog().find(f => f.name === name);
const icons = { remove: <i className="rm" />, add: <i className="plus" />, calendar: <i />, clear: <i />, check: <i /> };

describe('SearchCriteriaRow', () => {
  const row = (criterion, extra = {}) =>
    shallow(<SearchCriteriaRow catalog={donorCatalog()} criterion={criterion} onChange={() => {}} onRemove={() => {}} icons={icons} {...extra} />);

  test('le composant de valeur suit le type et l’opérateur', () => {
    expect(widgetForOperator(byName('cli_town'), 'containsb')).toBe('text');
    expect(widgetForOperator(byName('last_donation.don_real_ts'), 'between')).toBe('date-range');
    expect(widgetForOperator(byName('last_donation.don_real_ts'), 'gte')).toBe('date');
    expect(widgetForOperator(byName('donations.don_mnt_input'), 'between')).toBe('amount-range');
    expect(widgetForOperator(byName('donations.payment_type.ptyp_id'), 'eq')).toBe('pills');
    expect(widgetForOperator(byName('donations.grp_id'), 'eq')).toBe('select');
    expect(widgetForOperator(byName('cli_receipt'), 'eq')).toBe('bool');
    expect(widgetForOperator(byName('don_kind'), 'eq')).toBe('segmented');
    expect(widgetForOperator(null, 'eq')).toBe('text');
  });

  test('ligne vide : champs proposés sauf ceux déjà pris, valeur inactive', () => {
    const w = row({ id: 'a', name: '', operator: '', values: [] }, { usedNames: ['cli_town'] });
    const options = w.find('select.rbf-criteria-field option');
    expect(options.first().text()).toBe('Champ…');
    expect(options.filterWhere(o => o.prop('value') === 'cli_town').prop('disabled')).toBe(true);
    expect(options.filterWhere(o => o.prop('value') === 'cli_email').prop('disabled')).toBe(false);
    expect(w.find('select.rbf-criteria-operator').prop('disabled')).toBe(true);
    expect(w.find('input[disabled]').length).toBe(1);
  });

  test('choisir un champ pose son opérateur par défaut ; changer d’opérateur adapte la valeur', () => {
    const onChange = jest.fn();
    const w = row({ id: 'a', name: '', operator: '', values: [] }, { onChange });
    w.find('select.rbf-criteria-field').simulate('change', { target: { value: 'last_donation.don_real_ts' } });
    expect(onChange).toHaveBeenLastCalledWith({ id: 'a', name: 'last_donation.don_real_ts', operator: 'between', values: [] });
    const dates = row({ id: 'a', name: 'last_donation.don_real_ts', operator: 'between', values: ['2025-01-01', '2025-12-31'] }, { onChange });
    expect(dates.find(SearchFormField).prop('field').widget).toBe('date-range');
    expect(dates.find(SearchFormField).prop('value')).toEqual(['2025-01-01', '2025-12-31']);
    expect(dates.find('select.rbf-criteria-operator option').map(o => o.text())).toContain('entre');
    dates.find('select.rbf-criteria-operator').simulate('change', { target: { value: 'gte' } });
    expect(onChange).toHaveBeenLastCalledWith({ id: 'a', name: 'last_donation.don_real_ts', operator: 'gte', values: [] });
    dates.find('select.rbf-criteria-operator').simulate('change', { target: { value: 'empty' } });
    expect(onChange).toHaveBeenLastCalledWith({ id: 'a', name: 'last_donation.don_real_ts', operator: 'empty', values: [] });
    const town = row({ id: 'b', name: 'cli_town', operator: 'containsb', values: ['Me'] }, { onChange });
    town.find('select.rbf-criteria-operator').simulate('change', { target: { value: 'contains' } });
    expect(onChange).toHaveBeenLastCalledWith({ id: 'b', name: 'cli_town', operator: 'contains', values: ['Me'] });
  });

  test('vide / non vide : pas de valeur ; pastilles pour un choix multiple ; virtuel figé sur « est »', () => {
    const empty = row({ id: 'a', name: 'cli_email', operator: 'empty', values: [] });
    expect(empty.find('.rbf-criteria-novalue').text()).toBe('pas de valeur à saisir');
    expect(empty.find(SearchFormField).length).toBe(0);
    const onChange = jest.fn();
    const pills = row({ id: 'b', name: 'donations.payment_type.ptyp_id', operator: 'eq', values: [5] }, { onChange });
    expect(pills.find(SearchFormField).prop('field').widget).toBe('pills');
    pills.find(SearchFormField).prop('onChange')({ target: { value: [5, 14] } });
    expect(onChange).toHaveBeenLastCalledWith({ id: 'b', name: 'donations.payment_type.ptyp_id', operator: 'eq', values: [5, 14] });
    const virtual = row({ id: 'c', name: 'don_kind', operator: 'eq', values: ['regular'] });
    expect(virtual.find('select.rbf-criteria-operator').prop('disabled')).toBe(true);
    expect(virtual.find('select.rbf-criteria-operator option').map(o => o.text())).toEqual(['est']);
    expect(virtual.find(SearchFormField).prop('field').widget).toBe('segmented');
    expect(virtual.find(SearchFormField).prop('value')).toBe('regular');
  });

  test('× retire la ligne', () => {
    const onRemove = jest.fn();
    row({ id: 'z', name: 'cli_town', operator: 'contains', values: ['x'] }, { onRemove }).find('.rbf-criteria-remove').simulate('click');
    expect(onRemove).toHaveBeenCalledWith('z');
  });
});

describe('SearchCriteriaBuilder', () => {
  const rows = [
    { id: 'a', name: 'cli_town', operator: 'containsb', values: ['Me'] },
    { id: 'b', name: 'cli_email', operator: 'empty', values: [] },
  ];

  test('mode, lignes, ajout', () => {
    const onRowsChange = jest.fn();
    const onModeChange = jest.fn();
    const w = shallow(<SearchCriteriaBuilder catalog={donorCatalog()} rows={rows} mode={FILTER_MODE_AND} subject="les donateurs" onRowsChange={onRowsChange} onModeChange={onModeChange} icons={icons} />);
    expect(w.text()).toContain('Afficher les donateurs qui remplissent');
    expect(w.find(InputSegmented).prop('options').map(o => o.label)).toEqual(['tous les critères', 'au moins un']);
    w.find(InputSegmented).prop('onChange')({ target: { value: FILTER_MODE_OR } });
    expect(onModeChange).toHaveBeenCalledWith(FILTER_MODE_OR);
    expect(w.find(SearchCriteriaRow).length).toBe(2);
    expect(w.find(SearchCriteriaRow).at(0).prop('usedNames')).toEqual(['cli_town', 'cli_email']);
    w.find(Chip).simulate('click');
    const next = onRowsChange.mock.calls[0][0];
    expect(next.length).toBe(3);
    expect(next[2]).toMatchObject({ name: '', operator: '', values: [] });
    expect(next[2].id).toBeTruthy();
    w.find(SearchCriteriaRow).at(1).prop('onRemove')('b');
    expect(onRowsChange).toHaveBeenLastCalledWith([rows[0]]);
    w.find(SearchCriteriaRow).at(0).prop('onChange')({ ...rows[0], values: ['Metz'] });
    expect(onRowsChange.mock.calls[2][0][0].values).toEqual(['Metz']);
  });

  test('sans ligne : un mot ; tous les champs pris : plus d’ajout ; sans bascule de mode', () => {
    const w = shallow(<SearchCriteriaBuilder catalog={donorCatalog()} rows={[]} onRowsChange={() => {}} modeToggle={false} />);
    expect(w.find(InputSegmented).length).toBe(0);
    expect(w.text()).toContain('Aucun critère');
    const all = donorCatalog().filter(f => !f.hidden).map((f, i) => ({ id: String(i), name: f.name, operator: 'eq', values: [] }));
    const full = shallow(<SearchCriteriaBuilder catalog={donorCatalog()} rows={all} onRowsChange={() => {}} />);
    expect(full.find(Chip).prop('disabled')).toBe(true);
  });
});

describe('SearchDrawer', () => {
  const listFilter = () => {
    const f = new Filter();
    f.init(FILTER_MODE_AND, FILTER_OPER_LIKE);
    f.addFilter('group.id', 15, FILTER_OPER_EQUAL, true);
    f.replaceFilter('cli_town', ['Me'], 'containsb');
    f.setFilterValues('donations.payment_type.ptyp_id', [5]);
    f.addFilter('cli_firstname', 'dup', FILTER_OPER_LIKE, false, false, true, 'quick');
    return f;
  };

  test('à l’ouverture : lignes dérivées du filtre, mode, encart ; Appliquer rend un nouveau filtre', () => {
    const onApply = jest.fn();
    const w = shallow(<SearchDrawer open filter={listFilter()} catalog={donorCatalog()} onApply={onApply} onClose={() => {}} subject="les donateurs" sentenceSubject="Donateurs" storageKey="client" top={60} icons={icons} />);
    expect(w.find(Drawer).prop('top')).toBe(60);
    expect(w.find(Drawer).prop('storageKey')).toBe('client');
    const builder = w.find(SearchCriteriaBuilder);
    expect(builder.prop('rows').map(r => r.name)).toEqual(['cli_town', 'donations.payment_type.ptyp_id']);
    expect(builder.prop('mode')).toBe(FILTER_MODE_AND);
    expect(w.find(SearchSummary).length).toBe(1);
    builder.prop('onRowsChange')([...builder.prop('rows'), { id: 'n', name: 'cli_email', operator: 'empty', values: [] }]);
    builder.prop('onModeChange')(FILTER_MODE_OR);
    w.update();
    w.find(Drawer).prop('footer').props.children[1].props.onClick();
    const next = onApply.mock.calls[0][0];
    expect(next.getMode()).toBe(FILTER_MODE_OR);
    expect(next.hasFilter('cli_email')).toBe(true);
    expect(next.hasFilter('group.id')).toBe(true);
    expect(next.getFilters({ group: 'quick' }).length).toBe(1);
    expect(api(next).filter.and.or).toBeDefined();
  });

  test('Tout effacer vide les lignes ; les lignes sont redérivées à chaque ouverture, pas entre deux', () => {
    const onClearAll = jest.fn();
    const w = shallow(<SearchDrawer open={false} filter={listFilter()} catalog={donorCatalog()} onApply={() => {}} onClose={() => {}} onClearAll={onClearAll} />);
    expect(w.find(SearchCriteriaBuilder).prop('rows')).toEqual([]);
    w.setProps({ open: true });
    expect(w.find(SearchCriteriaBuilder).prop('rows').length).toBe(2);
    w.find(SearchCriteriaBuilder).prop('onRowsChange')([]);
    w.setProps({ filter: listFilter() });
    expect(w.find(SearchCriteriaBuilder).prop('rows').length).toBe(0);
    w.setProps({ open: false });
    w.setProps({ open: true });
    expect(w.find(SearchCriteriaBuilder).prop('rows').length).toBe(2);
    w.find(Drawer).prop('footer').props.children[0].props.onClick();
    expect(w.find(SearchCriteriaBuilder).prop('rows')).toEqual([]);
    expect(onClearAll).toHaveBeenCalled();
  });
});
