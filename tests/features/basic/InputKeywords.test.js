import React from 'react';
import { shallow } from 'enzyme';
import { InputKeywords } from '../../../src/features/basic';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<InputKeywords />);
  expect(renderedComponent.find('.basic-input-keywords').length).toBe(1);
});
