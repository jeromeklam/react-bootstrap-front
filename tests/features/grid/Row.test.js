import React from 'react';
import renderer from 'react-test-renderer';
import { Row } from '../../../src/features/grid';

const callback = jest.fn();

it('renders empty row', () => {
  // First render
  const component = renderer.create(<Row />);
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});

it('renders row with children', () => {
  // First render
  const component = renderer.create(
    <Row>
      <p>Test</p>
    </Row>
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});

it('renders row with children and className', () => {
  // First render
  const component = renderer.create(
    <Row className="row-even">
      <p>Test</p>
    </Row>
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});

it('renders row with props', () => {
  // First render
  const component = renderer.create(
    <Row onClick={callback} />
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});
