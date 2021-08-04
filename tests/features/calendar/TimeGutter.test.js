import React from 'react';
import { shallow } from 'enzyme';
import { TimeGutter } from '../../../src/features/calendar';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<TimeGutter />);
  expect(renderedComponent.find('.calendar-time-gutter').length).toBe(1);
});
