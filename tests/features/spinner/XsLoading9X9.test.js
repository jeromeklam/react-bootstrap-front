import React from 'react';
import { shallow } from 'enzyme';
import { XsLoading9X9 } from '../../../src/features/spinner';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<XsLoading9X9 />);
  expect(renderedComponent.find('.spinner-xs-loading-9-x-9').length).toBe(1);
});
