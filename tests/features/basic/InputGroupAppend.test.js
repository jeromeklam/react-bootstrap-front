import React from 'react';
import renderer from 'react-test-renderer';
import { InputGroupAppend } from '../../../src/features/basic';

const callback = jest.fn();
jest.useFakeTimers();

it('renders empty', () => {
  // First render
  const component = renderer.create(
    <InputGroupAppend />
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});

it('renders with content and className', () => {
  // First render
  const component = renderer.create(
    <InputGroupAppend className="append">
      <p>TEST</p>
    </InputGroupAppend>
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});