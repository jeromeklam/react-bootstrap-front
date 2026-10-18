import React from 'react';
import { shallow } from 'enzyme';
import { InputText, InputSegmented, InputPillGroup, InputDateRange, InputAmountRange, InputDate, InputMonetary } from '../../../src/features/basic';
import { SearchFormField, widgetFor, widthFor } from '../../../src/features/search';
import { donorCatalog } from './fixtures';

const byName = name => donorCatalog().find(f => f.name === name);
const icons = { calendar: <i className="cal" />, clear: <i className="del" />, check: <i className="chk" /> };
const render = (field, value, onChange = () => {}) => shallow(<SearchFormField field={field} value={value} onChange={onChange} icons={icons} />);

test('widget déduit du catalogue, largeur par défaut en 36es', () => {
  expect(widgetFor(byName('cli_town'))).toBe('text');
  expect(widgetFor(byName('client_category.clic_id'))).toBe('pills');
  expect(widgetFor(byName('donations.don_real_ts'))).toBe('date-range');
  expect(widgetFor(byName('last_donation.don_real_ts'))).toBe('date-range');
  expect(widgetFor(byName('donations.grp_id'))).toBe('select');
  expect(widgetFor(byName('cli_receipt'))).toBe('bool');
  expect(widgetFor(byName('don_kind'))).toBe('segmented');
  expect(widthFor(byName('client_category.clic_id'))).toBe(36);
  expect(widthFor(byName('donations.don_real_ts'))).toBe(15);
  expect(widthFor(byName('donations.don_mnt_input'))).toBe(12);
  expect(widthFor(byName('don_kind'))).toBe('auto');
  expect(widthFor({ ...byName('cli_town'), width: 9 })).toBe(9);
});

test('texte : InputText avec le libellé en placeholder, événement nommé', () => {
  const onChange = jest.fn();
  const w = render(byName('cli_town'), 'Me', onChange);
  expect(w.type()).toBe(InputText);
  expect(w.prop('placeholder')).toBe('Ville');
  expect(w.prop('label')).toBe('');
  expect(w.prop('value')).toBe('Me');
  w.prop('onChange')({ target: { value: 'Metz' } });
  expect(onChange).toHaveBeenCalledWith({ target: { name: 'cli_town', value: 'Metz' } });
});

test('pastilles, segmenté, booléen', () => {
  const pills = render(byName('client_category.clic_id'), [6]);
  expect(pills.type()).toBe(InputPillGroup);
  expect(pills.prop('value')).toEqual([6]);
  expect(pills.prop('checkIcon')).toBe(icons.check);
  const seg = render(byName('don_kind'), 'once');
  expect(seg.type()).toBe(InputSegmented);
  expect(seg.prop('options').length).toBe(3);
  const bool = render(byName('cli_receipt'), '1');
  expect(bool.type()).toBe(InputSegmented);
  expect(bool.prop('options').map(o => o.label)).toEqual(['Tous', 'oui', 'non']);
});

test('plages : icônes et unité transmises', () => {
  const dates = render(byName('donations.don_real_ts'), ['2025-01-01', '']);
  expect(dates.type()).toBe(InputDateRange);
  expect(dates.prop('calIcon')).toBe(icons.calendar);
  expect(dates.prop('value')).toEqual(['2025-01-01', '']);
  const amounts = render(byName('donations.don_mnt_input'), undefined);
  expect(amounts.type()).toBe(InputAmountRange);
  expect(amounts.prop('value')).toEqual(['', '']);
  expect(amounts.prop('unit')).toBe('€');
});

test('select simple natif, date et montant seuls, nombre', () => {
  const sel = render(byName('donations.grp_id'), 15);
  expect(sel.find('select').length).toBe(1);
  expect(sel.find('option').map(o => o.text())).toEqual(['Association', 'Kalaweit France', 'Kalaweit Belgique']);
  expect(sel.find('select').prop('value')).toBe('15');
  const date = render({ name: 'd', label: 'Date', type: 'date', defaultOperator: 'eq', options: [] }, '2025-01-01');
  expect(date.type()).toBe(InputDate);
  const amount = render({ name: 'm', label: 'Montant', type: 'monetary', defaultOperator: 'eq', options: [] }, '10');
  expect(amount.type()).toBe(InputMonetary);
  const number = render({ name: 'n', label: 'Nombre', type: 'number', widget: 'number', options: [] }, 3);
  expect(number.find('input[type="number"]').length).toBe(1);
});

test('render du catalogue et picker sans render', () => {
  const custom = render({ ...byName('cli_town'), render: ({ field, value }) => <em>{field.name}:{value}</em> }, 'x');
  expect(custom.text()).toBe('cli_town:x');
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const picker = render({ name: 'site.site_id', label: 'Refuge', type: 'picker', options: [] }, '');
  expect(picker.type()).toBeNull();
  warn.mockRestore();
});
