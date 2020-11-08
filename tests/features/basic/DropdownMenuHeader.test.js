import React from 'react';
import { shallow } from 'enzyme';
import { DropdownMenuHeader } from '../../../src/features/basic';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<DropdownMenuHeader />);
  expect(renderedComponent.find('.basic-dropdown-menu-header').length).toBe(1);
});
