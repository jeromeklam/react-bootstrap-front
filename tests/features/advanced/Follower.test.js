import React from 'react';
import renderer from 'react-test-renderer';
import { Follower } from '../../../src/features/advanced';

it('renders standard', () => {
  // First render
  const component = renderer.create(
    <Follower className="btn bg-secondary">
      <span>TEST</span>
    </Follower>
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});