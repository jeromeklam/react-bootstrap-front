import React from 'react';
import { shallow } from 'enzyme';
import { SortPanel } from '../../../src/features/sort';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<SortPanel />);
  expect(renderedComponent.find('.sort-sort-panel').length).toBe(1);
});
