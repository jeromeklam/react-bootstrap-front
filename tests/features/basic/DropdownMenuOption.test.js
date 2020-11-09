import React from 'react';
import renderer from 'react-test-renderer';
import { DropdownMenuOption } from '../../../src/features/basic';

const callback = jest.fn();

it('renders standard', () => {
  // First render
  const component = renderer.create(
    <DropdownMenuOption label="test" onClick={callback} />
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});