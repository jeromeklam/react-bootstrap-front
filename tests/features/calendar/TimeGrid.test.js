import React from 'react';
import { shallow } from 'enzyme';
import { TimeGrid } from '../../../src/features/calendar';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<TimeGrid />);
  expect(renderedComponent.find('.calendar-time-grid').length).toBe(1);
});
