import React from 'react';
import { shallow } from 'enzyme';
import { Selection } from '../../../src/features/calendar';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Selection />);
  expect(renderedComponent.find('.calendar-selection').length).toBe(1);
});
