import React from 'react';
import renderer from 'react-test-renderer';
import { DropdownMenu } from '../../../src/features/basic';

it('renders with className', () => {
  // First render
  const component = renderer.create(
    <DropdownMenu className="btn bg-secondary">
      <span>MENU</span>
    </DropdownMenu>
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});