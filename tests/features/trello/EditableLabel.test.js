import React from 'react';
import renderer from 'react-test-renderer';
import EditableLabel from '../../../src/features/trello/EditableLabel';

const callback = jest.fn();
jest.useFakeTimers();

it('render with className and name', () => {
  // First render
  const component = renderer.create(
    <EditableLabel className="btn bg-secondary" value="TEST"/>
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});
