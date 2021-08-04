import React from 'react';
import { shallow } from 'enzyme';
import { Header } from '../../../src/features/calendar';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Header />);
  expect(renderedComponent.find('.calendar-header').length).toBe(1);
});
