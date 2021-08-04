import React from 'react';
import { shallow } from 'enzyme';
import { EventEndingRow } from '../../../src/features/calendar';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<EventEndingRow />);
  expect(renderedComponent.find('.calendar-event-ending-row').length).toBe(1);
});
