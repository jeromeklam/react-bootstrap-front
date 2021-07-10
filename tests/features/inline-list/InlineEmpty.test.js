import React from 'react';
import { shallow } from 'enzyme';
import { InlineEmpty } from '../../../src/features/inline-list';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<InlineEmpty />);
  expect(renderedComponent.find('.inline-list-inline-empty').length).toBe(1);
});
