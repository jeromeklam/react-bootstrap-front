import React from 'react';
import { shallow } from 'enzyme';
import { InputPhone } from '../../../src/features/basic';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<InputPhone />);
  expect(renderedComponent.find('.basic-input-phone').length).toBe(1);
});
