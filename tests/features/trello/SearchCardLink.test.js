import React from 'react';
import renderer from 'react-test-renderer';
import SearchCardLink from '../../../src/features/trello/SearchCardLink';

const callback = jest.fn();

it('render with className and name', () => {
  // First render
  const component = renderer.create(
    <SearchCardLink className="btn bg-secondary" t={callback} onClick={callback}/>
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});