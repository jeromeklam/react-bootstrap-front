import React from 'react';
import { shallow } from 'enzyme';
import { Test } from '../../../src/features/basic';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Test />);
  expect(renderedComponent.find('.basic-test').length).toBe(1);
});
