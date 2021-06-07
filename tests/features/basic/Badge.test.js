import React from 'react';
import { shallow } from 'enzyme';
import { Badge } from '../../../src/features/basic';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Badge />);
  expect(renderedComponent.find('.basic-badge').length).toBe(1);
});
