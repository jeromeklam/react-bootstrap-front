import React from 'react';
import { shallow } from 'enzyme';
import { EventCell } from '../../../src/features/calendar';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<EventCell />);
  expect(renderedComponent.find('.calendar-event-cell').length).toBe(1);
});
