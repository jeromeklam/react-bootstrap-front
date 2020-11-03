import React from 'react';
import { shallow } from 'enzyme';
import { SvgMask } from '../../../src/features/advanced';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<SvgMask />);
  expect(renderedComponent.find('.advanced-svg-mask').length).toBe(1);
});
