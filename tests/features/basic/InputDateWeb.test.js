import React from 'react';
import { shallow } from 'enzyme';
import { InputDateWeb } from '../../../src/features/basic';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<InputDateWeb />);
  expect(renderedComponent.find('.basic-input-date').length).toBe(1);
});
