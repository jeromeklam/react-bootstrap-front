import React from 'react';
import { shallow } from 'enzyme';
import { WorkWeek } from '../../../src/features/calendar';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<WorkWeek />);
  expect(renderedComponent.find('.calendar-work-week').length).toBe(1);
});
