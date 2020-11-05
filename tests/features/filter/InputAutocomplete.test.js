import React from 'react';
import { shallow } from 'enzyme';
import { InputAutocomplete } from '../../../src/features/filter';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<InputAutocomplete />);
  expect(renderedComponent.find('.filter-input-autocomplete').length).toBe(1);
});
