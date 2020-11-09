import React from 'react';
import renderer from 'react-test-renderer';
import { InputAutocomplete } from '../../../src/features/filter';

const callback = jest.fn();

it('renders standard', () => {
  // First render
  const component = renderer.create(
    <InputAutocomplete id="test" name="test" type="TEST" list={[]} clearIcon={<span />} onSearch={callback} onSelect={callback} />
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});
