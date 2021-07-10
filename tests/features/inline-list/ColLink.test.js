import React from 'react';
import { shallow } from 'enzyme';
import { ColLink } from '../../../src/features/inline-list';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<ColLink />);
  expect(renderedComponent.find('.inline-list-col-link').length).toBe(1);
});
