import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { InputText } from '../../../src/features/basic';

const callback = jest.fn();
jest.useFakeTimers();

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
  let component;
  renderer.act(() => {
    component = renderer.create(
      <InputText id="input-text" name="input-text" className="input" value="tes" onChange={callback} />
    );
  });
  //
  const trigger = component.root.findByType('input');
  renderer.act(() => trigger.props.onChange({ target: { value: 'test' } }));
  expect(component.toJSON()).toMatchSnapshot();
  expect(callback).toBeCalled();
});
