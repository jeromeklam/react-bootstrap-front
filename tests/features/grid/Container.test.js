import React from 'react';
import renderer from 'react-test-renderer';
import { Container } from '../../../src/features/grid';
import { WidthObserverSetWidth } from 'react-observe-size';

const callback = jest.fn();

const resizeWindow = (x, y) => {
  WidthObserverSetWidth(x);
}

it('renders empty container', () => {
  // First render
  resizeWindow(500, 300);
  const component = renderer.create(<Container />);
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
  //
  resizeWindow(800, 300);
  component.update(<Container />);
  global.dispatchEvent(new Event('resize'))
  test = component.toJSON();
  expect(test).toMatchSnapshot();
  //
  resizeWindow(1024, 300);
  component.update(<Container />);
  global.dispatchEvent(new Event('resize'))
  test = component.toJSON();
  expect(test).toMatchSnapshot();
  //
  resizeWindow(1200, 300);
  component.update(<Container />);
  global.dispatchEvent(new Event('resize'))
  test = component.toJSON();
  expect(test).toMatchSnapshot();
  //
  resizeWindow(1600, 300);
  component.update(<Container />);
  global.dispatchEvent(new Event('resize'))
  test = component.toJSON();
  expect(test).toMatchSnapshot();
});

it('renders container with className', () => {
  // First render
  resizeWindow(500, 300);
  const component = renderer.create(<Container className="container" />);
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});

it('renders container with other props', () => {
  // First render
  resizeWindow(500, 300);
  const component = renderer.create(<Container onClick={callback} />);
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});