import React from 'react';
import renderer from 'react-test-renderer';
import { DropdownMenuDivider } from '../../../src/features/basic';

it('renders standard', () => {
  // First render
  const component = renderer.create(
    <DropdownMenuDivider />
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});