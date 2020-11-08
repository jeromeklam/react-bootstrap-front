import React from 'react';
import renderer from 'react-test-renderer';
import NewCardForm from '../../../src/features/trello/NewCardForm';

const callback = jest.fn();
jest.useFakeTimers();

it('renders with className', () => {
  // First render
  const component = renderer.create(<NewCardForm t={callback} />);
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});
