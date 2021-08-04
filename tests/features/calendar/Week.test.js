import React from 'react';
import { shallow } from 'enzyme';
import { Week } from '../../../src/features/calendar';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Week />);
  expect(renderedComponent.find('.calendar-week').length).toBe(1);
});
