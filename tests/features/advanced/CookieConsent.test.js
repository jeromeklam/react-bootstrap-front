import React from 'react';
import renderer from 'react-test-renderer';
import { CookieConsent } from '../../../src/features/advanced';

it('renders with className', () => {
  // First render
  const component = renderer.create(
    <CookieConsent className="btn bg-secondary" />
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});