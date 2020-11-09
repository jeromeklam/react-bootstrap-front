import React from 'react';
import { shallow } from 'enzyme';
import { SearchCardForm } from '../../../src/features/trello';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<SearchCardForm />);
  expect(renderedComponent.find('.trello-search-card-form').length).toBe(1);
});
