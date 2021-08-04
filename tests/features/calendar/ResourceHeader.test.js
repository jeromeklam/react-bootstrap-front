import React from 'react';
import { shallow } from 'enzyme';
import { ResourceHeader } from '../../../src/features/calendar';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<ResourceHeader />);
  expect(renderedComponent.find('.calendar-resource-header').length).toBe(1);
});
