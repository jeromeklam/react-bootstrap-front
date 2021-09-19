import React from 'react';
import { shallow } from 'enzyme';
import { InputJson } from '../../../src/features/basic';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<InputJson />);
  expect(renderedComponent.find('.basic-input-json').length).toBe(1);
});
