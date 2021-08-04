import React from 'react';
import { shallow } from 'enzyme';
import { InputDateNatif } from '../../../src/features/basic';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<InputDateNatif />);
  expect(renderedComponent.find('.basic-input-date-natif').length).toBe(1);
});
