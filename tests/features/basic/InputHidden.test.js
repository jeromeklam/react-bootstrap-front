import React from 'react';
import renderer from 'react-test-renderer';
import { InputHidden } from '../../../src/features/basic';

it('renders standard', () => {
  // First render
  const component = renderer.create(
    <InputHidden className="btn bg-secondary" id="input-hidden" name="hidden" value="test" />
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});
