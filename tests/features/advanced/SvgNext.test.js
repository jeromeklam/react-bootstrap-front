import React from 'react';
import renderer from 'react-test-renderer';
import { SvgNext } from '../../../src/features/advanced';

it('renders with className', () => {
  // First render
  const component = renderer.create(
    <SvgNext className="btn bg-secondary" />
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});