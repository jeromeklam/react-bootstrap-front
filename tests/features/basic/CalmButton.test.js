import React from 'react';
import renderer from 'react-test-renderer';
import { CalmButton } from '../../../src/features/basic';

const callback = jest.fn();
jest.useFakeTimers();

it('render with className and name', () => {
  // First render
  const component = renderer.create(
    <CalmButton className="btn bg-secondary" onClick={callback}>
      My Button
    </CalmButton>
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();

  // test click
  test.props.onClick();
  test = component.toJSON();
  expect(test).toMatchSnapshot();

  // Fast-forward until all timers have been executed
  jest.runAllTimers();
  test = component.toJSON();
  expect(test).toMatchSnapshot();
});
