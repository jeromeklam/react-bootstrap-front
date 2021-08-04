import React from 'react';
import { shallow } from 'enzyme';
import { DefaultLineAction } from '../../../src/features/inline-list';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<DefaultLineAction />);
  expect(renderedComponent.find('.inline-list-default-line-action').length).toBe(1);
});
