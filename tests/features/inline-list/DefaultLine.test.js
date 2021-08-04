import React from 'react';
import { shallow } from 'enzyme';
import { DefaultLine } from '../../../src/features/inline-list';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<DefaultLine />);
  expect(renderedComponent.find('.inline-list-default-line').length).toBe(1);
});
