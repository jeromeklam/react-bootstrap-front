import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { act, Simulate } from 'react-dom/test-utils';
import { InputSelect } from '../../../src/features/basic';

const callback = jest.fn();

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  jest.clearAllMocks();
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('renders standard with label and options', () => {
  // First render
  const component = renderer.create(
    <InputSelect
      className="btn bg-secondary"
      onChange={callback}
      label="Select"
      id="input-select"
      name="select"
      value="TEST 1"
      options={[{ label: 'test 1', value: 'TEST 1' }, { label: 'test 2', value: 'TEST 2' }]}
    />
  );
  expect(callback).toHaveBeenCalledTimes(0);
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});

it('renders standard with label and options with empty on', () => {
  // First render
  const component = renderer.create(
    <InputSelect
      className="btn bg-secondary"
      onChange={callback}
      label="Select"
      id="input-select"
      name="select"
      value=""
      addEmpty={true}
      options={[{ label: 'test 1', value: 'TEST 1' }, { label: 'test 2', value: 'TEST 2' }]}
    />
  );
  expect(callback).toHaveBeenCalledTimes(0);
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});

it('renders standard with label and options with empty on and default values', () => {
  // First render
  const component = renderer.create(
    <InputSelect
      className="btn bg-secondary"
      onChange={callback}
      label="Select"
      id="input-select"
      name="select"
      value=""
      addEmpty={true}
      defaultValue="0"
      defaultLabel="None"
      options={[{ label: 'test 1', value: 'TEST 1' }, { label: 'test 2', value: 'TEST 2' }]}
    />
  );
  expect(callback).toHaveBeenCalledTimes(1);
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});

it('renders standard and verify onChange on unexisting value', () => {
  // First render
  act(() => {
    ReactDOM.render(
      <InputSelect
        className="btn bg-secondary"
        onChange={callback}
        label="Select"
        id="input-select"
        name="select"
        value="TEST 3"
        options={[{ label: 'test 1', value: 'TEST 1' }, { label: 'test 2', value: 'TEST 2' }]}
      />,
      container
    );
  });
  expect(callback).toHaveBeenCalledTimes(1);
  //
  const input = container.querySelector('select');
  Simulate.change(input, { target: { value: 'TEST 1' } });
  expect(callback).toHaveBeenCalledTimes(2);
});
