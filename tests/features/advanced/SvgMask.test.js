import React from 'react';
import renderer from 'react-test-renderer';
import { SvgMask } from '../../../src/features/advanced';

it('renders with className', () => {
  // First render
  const component = renderer.create(
    <SvgMask className="btn bg-secondary" />
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});