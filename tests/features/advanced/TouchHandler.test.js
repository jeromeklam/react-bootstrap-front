import React from 'react';
import { shallow } from 'enzyme';
import { TouchHandler } from '../../../src/features/advanced';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<TouchHandler />);
  expect(renderedComponent.find('.advanced-touch-handler').length).toBe(1);
});
