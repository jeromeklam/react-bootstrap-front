import React from 'react';
import renderer from 'react-test-renderer';
import { SvgCheckbox } from '../../../src/features/advanced';

it('renders with className', () => {
  // First render
  const component = renderer.create(
    <SvgCheckbox className="btn bg-secondary" />
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});

it('renders checked', () => {
  // First render
  const component = renderer.create(
    <SvgCheckbox checked />
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});