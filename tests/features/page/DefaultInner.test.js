import React from 'react';
import { shallow } from 'enzyme';
import { DefaultInner } from '../../../src/features/page';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<DefaultInner />);
  expect(renderedComponent.find('.page-default-inner').length).toBe(1);
});
