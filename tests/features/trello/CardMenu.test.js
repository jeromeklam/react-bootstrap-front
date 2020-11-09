import React from 'react';
import renderer from 'react-test-renderer';
import CardMenu from '../../../src/features/trello/CardMenu';

const callback = jest.fn();

it('renders standard', () => {
  // First render
  const component = renderer.create(
    <CardMenu t={callback} />
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});
