import React from 'react';
import { shallow } from 'enzyme';
import { InputChildren } from '../../../src/features/basic';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<InputChildren />);
  expect(renderedComponent.find('.basic-input-children').length).toBe(1);
});
