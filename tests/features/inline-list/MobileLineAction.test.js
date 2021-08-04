import React from 'react';
import { shallow } from 'enzyme';
import { MobileLineAction } from '../../../src/features/inline-list';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<MobileLineAction />);
  expect(renderedComponent.find('.inline-list-mobile-line-action').length).toBe(1);
});
