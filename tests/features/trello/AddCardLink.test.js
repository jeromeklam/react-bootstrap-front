import React from 'react';
import renderer from 'react-test-renderer';
import AddCardLink from '../../../src/features/trello/AddCardLink';

const callback = jest.fn();
jest.useFakeTimers();

it('renders standard', () => {
  // First render
  const component = renderer.create(
    <AddCardLink onClick={callback} t={callback} />
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});
