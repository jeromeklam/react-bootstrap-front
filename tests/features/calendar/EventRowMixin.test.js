import React from 'react';
import { shallow } from 'enzyme';
import { EventRowMixin } from '../../../src/features/calendar';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<EventRowMixin />);
  expect(renderedComponent.find('.calendar-event-row-mixin').length).toBe(1);
});
