import React from 'react';
import { shallow } from 'enzyme';
import { BackgroundCells } from '../../../src/features/calendar';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<BackgroundCells />);
  expect(renderedComponent.find('.calendar-background-cells').length).toBe(1);
});
