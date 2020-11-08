import React from 'react';
import { shallow } from 'enzyme';
import { DropdownWrapper } from '../../../src/features/advanced';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<DropdownWrapper />);
  expect(renderedComponent.find('.advanced-dropdown-wrapper').length).toBe(1);
});
