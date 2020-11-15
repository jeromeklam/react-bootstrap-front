import React from 'react';
import renderer from 'react-test-renderer';
import LaneMenu from '../../../src/features/trello/CardMenu';

const callback = jest.fn();

it('renders standard', () => {
  // First render
  const component = renderer.create(
    <LaneMenu t={callback} />
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});
