import React from 'react';
import { shallow } from 'enzyme';
import { DateHeader } from '../../../src/features/calendar';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<DateHeader />);
  expect(renderedComponent.find('.calendar-date-header').length).toBe(1);
});
