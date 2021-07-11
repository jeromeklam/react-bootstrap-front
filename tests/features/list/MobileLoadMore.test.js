import React from 'react';
import { shallow } from 'enzyme';
import { MobileLoadMore } from '../../../src/features/list';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<MobileLoadMore />);
  expect(renderedComponent.find('.list-mobile-load-more').length).toBe(1);
});
