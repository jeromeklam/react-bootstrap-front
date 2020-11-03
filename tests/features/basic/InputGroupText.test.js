import React from 'react';
import renderer from 'react-test-renderer';
import { InputGroupText } from '../../../src/features/basic';

const callback = jest.fn();
jest.useFakeTimers();

it('renders empty', () => {
  // First render
  const component = renderer.create(
    <InputGroupText />
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});

it('renders with content and className', () => {
  // First render
  const component = renderer.create(
    <InputGroupText className="text">
      <p>TEST</p>
    </InputGroupText>
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});