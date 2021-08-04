import React from 'react';
import { shallow } from 'enzyme';
import { InputPhoto } from '../../../src/features/basic';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<InputPhoto />);
  expect(renderedComponent.find('.basic-input-photo').length).toBe(1);
});
