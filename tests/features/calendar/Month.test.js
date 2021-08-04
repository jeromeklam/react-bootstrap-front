import React from 'react';
import { shallow } from 'enzyme';
import { Month } from '../../../src/features/calendar';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Month />);
  expect(renderedComponent.find('.calendar-month').length).toBe(1);
});
