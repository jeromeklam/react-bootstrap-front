import React from 'react';
import renderer from 'react-test-renderer';
import { Col } from '../../../src/features/grid';

const callback = jest.fn();

it('renders empty col', () => {
  // First render
  const component = renderer.create(<Col />);
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});

it('renders col with children', () => {
  // First render
  const component = renderer.create(
    <Col>
      <p>Test</p>
    </Col>
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});

it('renders col with children and className', () => {
  // First render
  const component = renderer.create(
    <Col className="col-first">
      <p>Test</p>
    </Col>
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});

it('renders col with props', () => {
  // First render
  const component = renderer.create(
    <Col onClick={callback} />
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});

it('renders col with string size', () => {
  // First render
  const component = renderer.create(
    <Col size="36" />
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
  //
  component.update(<Col size="12" />);
  test = component.toJSON();
  expect(test).toMatchSnapshot();
  //
  component.update(<Col size="0" />);
  test = component.toJSON();
  expect(test).toMatchSnapshot();
});

it('renders col with number size', () => {
  // First render
  const component = renderer.create(
    <Col size={36}/>
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});

it('renders col with complex size', () => {
  // First render
  const component = renderer.create(
    <Col size={{xs: 36, sm: 18, lg: 0, xl: 'none'}}/>
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});