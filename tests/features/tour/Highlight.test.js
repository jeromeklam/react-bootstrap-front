import React from 'react';
import renderer from 'react-test-renderer';
import { Highlight } from '../../../src/features/tour';

it('render with className and name', () => {
  // First render
  const component = renderer.create(
    <Highlight id="test" theme="TEST">
      My Button
    </Highlight>
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});
