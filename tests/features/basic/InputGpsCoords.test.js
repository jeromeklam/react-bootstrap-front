import React from 'react';
import { shallow } from 'enzyme';
import { InputGpsCoords } from '../../../src/features/basic';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<InputGpsCoords />);
  expect(renderedComponent.find('.basic-input-gps-coords').length).toBe(1);
});
