import React from 'react';
import { shallow } from 'enzyme';
import { DefaultPageHeader } from '../../../src/features/page';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<DefaultPageHeader />);
  expect(renderedComponent.find('.page-default-page-header').length).toBe(1);
});
