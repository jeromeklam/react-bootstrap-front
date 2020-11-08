import React from 'react';
import renderer from 'react-test-renderer';
import { HighlightArrow } from '../../../src/features/tour';

it('renders with className', () => {
  // First render
  const component = renderer.create(
    <HighlightArrow className="btn bg-secondary" />
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});

it('renders with className and inverted', () => {
  // First render
  const component = renderer.create(
    <HighlightArrow inverted className="btn bg-secondary" />
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});