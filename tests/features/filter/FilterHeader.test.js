import React from 'react';
import { shallow } from 'enzyme';
import { FilterHeader } from '../../../src/features/filter';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<FilterHeader />);
  expect(renderedComponent.find('.filter-filter-header').length).toBe(1);
});
