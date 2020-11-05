import React from 'react';
import renderer from 'react-test-renderer';
import { SvgPlay } from '../../../src/features/advanced';

const callback = jest.fn();
jest.useFakeTimers();

it('renders with className', () => {
  // First render
  const component = renderer.create(
    <SvgPlay className="btn bg-secondary" />
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});