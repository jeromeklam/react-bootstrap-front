import React from 'react';
import { shallow } from 'enzyme';
import { ResponsivePageHeader } from '../../../src/features/page';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<ResponsivePageHeader />);
  expect(renderedComponent.find('.page-responsive-page-header').length).toBe(1);
});
