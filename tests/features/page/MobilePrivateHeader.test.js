import React from 'react';
import { shallow } from 'enzyme';
import { MobilePrivateHeader } from '../../../src/features/page';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<MobilePrivateHeader />);
  expect(renderedComponent.find('.page-mobile-private-header').length).toBe(1);
});
