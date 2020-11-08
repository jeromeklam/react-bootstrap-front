import React from 'react';
import renderer from 'react-test-renderer';
import DeleteButton from '../../../src/features/trello/DeleteButton';

const callback = jest.fn();
jest.useFakeTimers();

it('render with className and name', () => {
  // First render
  const component = renderer.create(
    <DeleteButton className="btn bg-secondary" onClick={callback}>
      My Button
    </DeleteButton>
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});
