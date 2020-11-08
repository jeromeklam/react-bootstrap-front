import React from 'react';
import renderer from 'react-test-renderer';
import Trello from '../../../src/features/trello/Trello';

const callback = jest.fn();
jest.useFakeTimers();

it('render with className and name', () => {
  // First render
  const component = renderer.create(<Trello data={{ lanes: [] }} />);
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});
