import React from 'react';
import { shallow } from 'enzyme';
import { ButtonPicker } from '../../../src/features/basic';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<ButtonPicker />);
  expect(renderedComponent.find('.basic-button-picker').length).toBe(1);
});
