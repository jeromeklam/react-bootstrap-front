import React from 'react';
import { shallow } from 'enzyme';
import { InlineAddOne } from '../../../src/features/inline-list';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<InlineAddOne />);
  expect(renderedComponent.find('.inline-list-add-one').length).toBe(1);
});
