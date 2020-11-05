import React from 'react';
import { shallow } from 'enzyme';
import { Follower } from '../../../src/features/advanced';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Follower />);
  expect(renderedComponent.find('.advanced-follower').length).toBe(1);
});
