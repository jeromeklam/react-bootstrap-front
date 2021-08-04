import React from 'react';
import { shallow } from 'enzyme';
import { DayColumn } from '../../../src/features/calendar';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<DayColumn />);
  expect(renderedComponent.find('.calendar-day-column').length).toBe(1);
});
