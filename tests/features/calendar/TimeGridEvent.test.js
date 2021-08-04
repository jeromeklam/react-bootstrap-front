import React from 'react';
import { shallow } from 'enzyme';
import { TimeGridEvent } from '../../../src/features/calendar';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<TimeGridEvent />);
  expect(renderedComponent.find('.calendar-time-grid-event').length).toBe(1);
});
