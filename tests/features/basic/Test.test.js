import React from 'react';
import renderer from 'react-test-renderer';
import { Test } from '../../../src/features/basic';

const callback = jest.fn();
jest.useFakeTimers();

it('render with className and name', () => {
  // First render
  const component = renderer.create(
    <Test className="btn bg-secondary" onClick={callback}>
      My Button
    </Test>
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});
