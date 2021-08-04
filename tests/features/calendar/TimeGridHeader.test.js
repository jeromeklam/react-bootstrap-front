import React from 'react';
import { shallow } from 'enzyme';
import { TimeGridHeader } from '../../../src/features/calendar';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<TimeGridHeader />);
  expect(renderedComponent.find('.calendar-time-grid-header').length).toBe(1);
});
