import React from 'react';
import { shallow } from 'enzyme';
import { EventWrapper } from '../../../src/features/calendar';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<EventWrapper />);
  expect(renderedComponent.find('.calendar-event-wrapper').length).toBe(1);
});
