import React from 'react';
import { shallow } from 'enzyme';
import { Popup } from '../../../src/features/calendar';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Popup />);
  expect(renderedComponent.find('.calendar-popup').length).toBe(1);
});
