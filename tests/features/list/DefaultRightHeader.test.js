import React from 'react';
import { shallow } from 'enzyme';
import { DefaultRightHeader } from '../../../src/features/list';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<DefaultRightHeader />);
  expect(renderedComponent.find('.list-default-right-header').length).toBe(1);
});
