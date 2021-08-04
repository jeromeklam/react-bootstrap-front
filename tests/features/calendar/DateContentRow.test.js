import React from 'react';
import { shallow } from 'enzyme';
import { DateContentRow } from '../../../src/features/calendar';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<DateContentRow />);
  expect(renderedComponent.find('.calendar-date-content-row').length).toBe(1);
});
