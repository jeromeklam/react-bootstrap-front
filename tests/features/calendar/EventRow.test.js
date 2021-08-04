import React from 'react';
import { shallow } from 'enzyme';
import { EventRow } from '../../../src/features/calendar';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<EventRow />);
  expect(renderedComponent.find('.calendar-event-row').length).toBe(1);
});
