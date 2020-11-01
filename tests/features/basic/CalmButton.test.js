import React from 'react';
import { shallow } from 'enzyme';
import { CalmButton } from '../../../src/features/basic';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<CalmButton />);
  expect(renderedComponent.find('.basic-calm-button').length).toBe(1);
});
