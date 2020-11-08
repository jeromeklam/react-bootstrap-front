import React from 'react';
import { shallow } from 'enzyme';
import { DropdownMenu } from '../../../src/features/basic';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<DropdownMenu />);
  expect(renderedComponent.find('.basic-dropdown-menu').length).toBe(1);
});
