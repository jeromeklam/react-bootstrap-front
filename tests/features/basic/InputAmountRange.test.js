import React from 'react';
import { shallow } from 'enzyme';
import { InputAmountRange, InputMonetary } from '../../../src/features/basic';

const render = (props = {}) => shallow(<InputAmountRange name="don_mnt" onChange={() => {}} {...props} />).dive();

test('deux champs monétaires « de » et « à », unité et allowNull transmis', () => {
  const wrapper = render({ value: ['10', '100'] });
  const fields = wrapper.find(InputMonetary);
  expect(fields.length).toBe(2);
  expect(fields.map(f => f.prop('prepend'))).toEqual(['de', 'à']);
  expect(fields.map(f => f.prop('value'))).toEqual(['10', '100']);
  expect(fields.at(0).prop('inputMoney')).toBe('€');
  expect(fields.at(0).prop('allowNull')).toBe(true);
});

test('changer une borne émet la paire ; une valeur numérique devient une chaîne', () => {
  const onChange = jest.fn();
  const wrapper = render({ value: [10, null], onChange, unit: 'CHF' });
  expect(wrapper.find(InputMonetary).at(1).prop('inputMoney')).toBe('CHF');
  wrapper.find(InputMonetary).at(1).prop('onChange')({ target: { value: '250.5' } });
  expect(onChange).toHaveBeenCalledWith({ target: { name: 'don_mnt', value: ['10', '250.5'] } });
});
