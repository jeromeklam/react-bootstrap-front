import React from 'react';
import { shallow } from 'enzyme';
import { MobilePageHeader } from '../../../src/features/page';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<MobilePageHeader />);
  expect(renderedComponent.find('.page-mobile-page-header').length).toBe(1);
});
