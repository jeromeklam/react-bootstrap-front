import React from 'react';
import renderer from 'react-test-renderer';
import { HighlightButton } from '../../../src/features/tour';

it('render with className and name', () => {
  // First render
  const component = renderer.create(
    <HighlightButton theme="TEST">
      <button>Help</button>
    </HighlightButton>
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});
