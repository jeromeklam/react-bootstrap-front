import React from 'react';
import { shallow } from 'enzyme';
import { IconWrapper } from '../../../src/features/calendar';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<IconWrapper />);
  expect(renderedComponent.find('.calendar-icon-wrapper').length).toBe(1);
});
