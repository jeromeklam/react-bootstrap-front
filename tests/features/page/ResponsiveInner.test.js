import React from 'react';
import { shallow } from 'enzyme';
import { ResponsiveInner } from '../../../src/features/page';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<ResponsiveInner />);
  expect(renderedComponent.find('.page-responsive-inner').length).toBe(1);
});
