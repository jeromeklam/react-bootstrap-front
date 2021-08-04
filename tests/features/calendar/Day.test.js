import React from 'react';
import { shallow } from 'enzyme';
import { Day } from '../../../src/features/calendar';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Day />);
  expect(renderedComponent.find('.calendar-day').length).toBe(1);
});
