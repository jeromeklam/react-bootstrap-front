import React from 'react';
import renderer from 'react-test-renderer';
import InlineInput from '../../../src/features/trello/InlineInput';

const callback = jest.fn();
jest.useFakeTimers();

it('render with className and name', () => {
  // First render
  const component = renderer.create(
    <InlineInput className="btn bg-secondary" onClick={callback}>
      My Button
    </InlineInput>
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});
