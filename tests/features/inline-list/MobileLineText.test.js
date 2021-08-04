import React from 'react';
import { shallow } from 'enzyme';
import { MobileLineText } from '../../../src/features/inline-list';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<MobileLineText />);
  expect(renderedComponent.find('.inline-list-mobile-line-text').length).toBe(1);
});
