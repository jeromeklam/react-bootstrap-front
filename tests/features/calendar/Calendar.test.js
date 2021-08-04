import React from 'react';
import { shallow } from 'enzyme';
import { Calendar } from '../../../src/features/calendar';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Calendar />);
  expect(renderedComponent.find('.calendar-calendar').length).toBe(1);
});
