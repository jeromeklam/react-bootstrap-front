import React from 'react';
import renderer from 'react-test-renderer';
import { DropdownMenuHeader } from '../../../src/features/basic';

it('renders standard', () => {
  // First render
  const component = renderer.create(
    <DropdownMenuHeader label="test" />
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});