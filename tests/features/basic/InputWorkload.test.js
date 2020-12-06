import React from 'react';
import { shallow } from 'enzyme';
import { InputWorkload } from '../../../src/features/basic';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<InputWorkload />);
  expect(renderedComponent.find('.basic-input-workload').length).toBe(1);
});
