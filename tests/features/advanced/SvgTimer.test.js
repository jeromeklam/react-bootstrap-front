import React from 'react';
import renderer from 'react-test-renderer';
import { SvgTimer } from '../../../src/features/advanced';

const callback = jest.fn();
jest.useFakeTimers();

it('renders with className', () => {
  // First render
  const component = renderer.create(
    <SvgTimer className="btn bg-secondary" />
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});