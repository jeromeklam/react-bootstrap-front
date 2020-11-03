import React from 'react';
import renderer from 'react-test-renderer';
import { InputGroupPrepend } from '../../../src/features/basic';

const callback = jest.fn();
jest.useFakeTimers();

it('renders empty', () => {
  // First render
  const component = renderer.create(
    <InputGroupPrepend />
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});

it('renders with content and className', () => {
  // First render
  const component = renderer.create(
    <InputGroupPrepend className="prepend">
      <p>TEST</p>
    </InputGroupPrepend>
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});