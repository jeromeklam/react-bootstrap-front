import React from 'react';
import { shallow } from 'enzyme';
import { Agenda } from '../../../src/features/calendar';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Agenda />);
  expect(renderedComponent.find('.calendar-agenda').length).toBe(1);
});
