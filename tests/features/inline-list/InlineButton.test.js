import React from 'react';
import { shallow } from 'enzyme';
import { InlineButton } from '../../../src/features/inline-list';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<InlineButton />);
  expect(renderedComponent.find('.inline-list-inline-button').length).toBe(1);
});
