import React from 'react';
import renderer from 'react-test-renderer';
import { HighlightButton } from '../../../src/features/tour';

it('renders standard with theme', () => {
  // First render
  const component = renderer.create(
    <HighlightButton theme="TEST" />
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});

it('renders with theme and specific content', () => {
  // First render
  const component = renderer.create(
    <HighlightButton theme="TEST">
      <button>Help</button>
    </HighlightButton>
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});
