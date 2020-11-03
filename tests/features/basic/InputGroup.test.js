import React from 'react';
import renderer from 'react-test-renderer';
import { InputGroup } from '../../../src/features/basic';

it('renders empty content', () => {
  // First render
  const component = renderer.create(<InputGroup />);
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});

it('renders with content', () => {
  // First render
  const component = renderer.create(
    <InputGroup>
      <input type="text" />
    </InputGroup>
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});

it('renders with content and label', () => {
  // First render
  const component = renderer.create(
    <InputGroup label="Test">
      <input type="text" />
    </InputGroup>
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});

it('renders with content and label not on top', () => {
  // First render
  const component = renderer.create(
    <InputGroup label="Test" labelTop={false}>
      <input type="text" />
    </InputGroup>
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});

it('renders with content and label not on top with size', () => {
  // First render
  const component = renderer.create(
    <InputGroup label="Test" labelTop={false} labelSize={10} inputSize={26}>
      <input type="text" />
    </InputGroup>
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});

it('renders with content and label not on top with complex size', () => {
  // First render
  const component = renderer.create(
    <InputGroup label="Test" labelTop={false} labelSize={{ xs: 10, sm: 12 }} inputSize={{ xs: 26, sm: 24 }}>
      <input type="text" />
    </InputGroup>
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});

it('renders with content, label and text error', () => {
  // First render
  const component = renderer.create(
    <InputGroup label="Test" error="Error">
      <input type="text" />
    </InputGroup>
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});

it('renders with content, label and element error', () => {
  // First render
  const component = renderer.create(
    <InputGroup label="Test" error={<span>Error</span>}>
      <input type="text" />
    </InputGroup>
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});

it('renders with content, label and element helper', () => {
  // First render
  const component = renderer.create(
    <InputGroup label="Test" help={<span>Help</span>}>
      <input type="text" />
    </InputGroup>
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});
