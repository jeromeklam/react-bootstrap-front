import React from 'react';
import { shallow } from 'enzyme';
import { TimeSlotGroup } from '../../../src/features/calendar';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<TimeSlotGroup />);
  expect(renderedComponent.find('.calendar-time-slot-group').length).toBe(1);
});
