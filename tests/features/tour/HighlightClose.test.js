import React from 'react';
import renderer from 'react-test-renderer';
import { HighlightClose } from '../../../src/features/tour';

it('renders with className', () => {
  // First render
  const component = renderer.create(
    <HighlightClose />
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});