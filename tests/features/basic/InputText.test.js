import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { act, Simulate } from 'react-dom/test-utils';
import { InputText } from '../../../src/features/basic';

const callback = jest.fn();
jest.useFakeTimers();

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('renders standard', () => {
  // First render
  const component = renderer.create(
    <InputText id="input-text" name="input-text" className="input" onChange={callback} />
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});

it('renders standard with label', () => {
  // First render
  const component = renderer.create(
    <InputText id="input-text" label="Input" name="input-text" className="input" onChange={callback} />
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});

it('renders standard and verify onChange is called', () => {
  // First render
  act(() => {
    ReactDOM.render(
      <InputText id="input-text" name="input-text" className="input" value="tes" onChange={callback} />,
      container
    );
  });
  //
  const input = container.querySelector('input');
  Simulate.change(input, {target: {value: 'test'}});
  expect(callback).toBeCalled();
});
