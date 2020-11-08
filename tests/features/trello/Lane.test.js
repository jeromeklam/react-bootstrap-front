import React from 'react';
import renderer from 'react-test-renderer';
import Lane from '../../../src/features/trello/Lane';

const callback = jest.fn();
jest.useFakeTimers();

it('render with className and name', () => {
  // First render
  const component = renderer.create(
    <Lane className="btn bg-secondary" onClick={callback}>
      My Button
    </Lane>
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});
