import React from 'react';
import renderer from 'react-test-renderer';
import Board from '../../../src/features/trello/Board';

const callback = jest.fn();
jest.useFakeTimers();

it('render with className and name', () => {
  // First render
  const component = renderer.create(
    <Board />
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});
