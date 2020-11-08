import React from 'react';
import renderer from 'react-test-renderer';
import Card from '../../../src/features/trello/Card';

const callback = jest.fn();
jest.useFakeTimers();

it('render with className and name', () => {
  // First render
  const component = renderer.create(
    <Card className="btn bg-secondary" onClick={callback}>
      My Button
    </Card>
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});
