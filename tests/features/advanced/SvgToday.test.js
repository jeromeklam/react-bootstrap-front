import React from 'react';
import { shallow } from 'enzyme';
import { SvgToday } from '../../../src/features/advanced';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<SvgToday />);
  expect(renderedComponent.find('.advanced-svg-today').length).toBe(1);
});
