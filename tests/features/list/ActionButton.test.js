import React from 'react';
import { shallow } from 'enzyme';
import { ActionButton } from '../../../src/features/list';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<ActionButton />);
  expect(renderedComponent.find('.list-action-button').length).toBe(1);
});
