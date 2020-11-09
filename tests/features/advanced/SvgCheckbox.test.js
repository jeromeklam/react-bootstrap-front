import React from 'react';
import { shallow } from 'enzyme';
import { SvgCheckbox } from '../../../src/features/advanced';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<SvgCheckbox />);
  expect(renderedComponent.find('.advanced-svg-checkbox').length).toBe(1);
});
