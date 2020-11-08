import React from 'react';
import { shallow } from 'enzyme';
import { DropdownMenuOption } from '../../../src/features/basic';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<DropdownMenuOption />);
  expect(renderedComponent.find('.basic-dropdown-menu-option').length).toBe(1);
});
