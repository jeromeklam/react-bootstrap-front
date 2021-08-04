import React from 'react';
import { shallow } from 'enzyme';
import { Toolbar } from '../../../src/features/calendar';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Toolbar />);
  expect(renderedComponent.find('.calendar-toolbar').length).toBe(1);
});
