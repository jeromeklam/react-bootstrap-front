import React from 'react';
import renderer from 'react-test-renderer';
import { Highlight } from '../../../src/features/tour';

const callback = jest.fn();
jest.useFakeTimers();

it('render with className and name', () => {
  // First render
  const component = renderer.create(
    <Highlight theme="TEST">
      My Button
    </Highlight>
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});
