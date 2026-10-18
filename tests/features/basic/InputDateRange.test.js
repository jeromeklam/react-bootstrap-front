import React from 'react';
import { shallow } from 'enzyme';
import { InputDateRange, InputDate } from '../../../src/features/basic';

const cal = <i className="cal" />;
const del = <i className="del" />;

const render = (props = {}) =>
  shallow(<InputDateRange name="don_real" calIcon={cal} delIcon={del} onChange={() => {}} {...props} />).dive();

test('deux champs date, préfixés « du » et « au », qui reçoivent les icônes', () => {
  const wrapper = render({ value: ['2025-01-01', '2025-12-31'] });
  const fields = wrapper.find(InputDate);
  expect(fields.length).toBe(2);
  expect(fields.at(0).prop('prepend')).toBe('du');
  expect(fields.at(1).prop('prepend')).toBe('au');
  expect(fields.at(0).prop('value')).toBe('2025-01-01');
  expect(fields.at(1).prop('value')).toBe('2025-12-31');
  expect(fields.at(0).prop('name')).toBe('don_real.from');
  expect(fields.at(1).prop('name')).toBe('don_real.to');
  expect(fields.at(0).prop('calIcon')).toBe(cal);
  expect(fields.at(1).prop('delIcon')).toBe(del);
  expect(fields.at(0).prop('label')).toBe('');
});

test('changer une borne émet la paire complète', () => {
  const onChange = jest.fn();
  const wrapper = render({ value: ['2025-01-01', ''], onChange });
  wrapper.find(InputDate).at(1).prop('onChange')({ target: { value: '2025-12-31' } });
  expect(onChange).toHaveBeenCalledWith({ target: { name: 'don_real', value: ['2025-01-01', '2025-12-31'] } });
  wrapper.find(InputDate).at(0).prop('onClear')();
  expect(onChange).toHaveBeenLastCalledWith({ target: { name: 'don_real', value: ['', ''] } });
});

test('sans valeur : deux bornes vides, libellé et aide', () => {
  const wrapper = render({ label: 'Paiement', help: 'Une seule borne suffit' });
  expect(wrapper.find(InputDate).map(f => f.prop('value'))).toEqual(['', '']);
  expect(wrapper.find('label').text()).toBe('Paiement');
  expect(wrapper.find('small').text()).toBe('Une seule borne suffit');
});

test('les préfixes et le t sont personnalisables', () => {
  const t = tr => tr.id;
  const wrapper = shallow(<InputDateRange name="d" calIcon={cal} delIcon={del} onChange={() => {}} t={t} />).dive();
  expect(wrapper.find(InputDate).at(0).prop('prepend')).toBe('rbf.range.from');
  const custom = render({ fromLabel: 'entre le', toLabel: 'et le' });
  expect(custom.find(InputDate).map(f => f.prop('prepend'))).toEqual(['entre le', 'et le']);
});
