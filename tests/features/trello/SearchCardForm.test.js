import React from 'react';
import renderer from 'react-test-renderer';
import SearchCardForm from '../../../src/features/trello/SearchCardForm';

const callback = jest.fn();

it('render with className and name', () => {
  // First render
  const component = renderer.create(
    <SearchCardForm className="btn bg-secondary" t={callback} />
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});
