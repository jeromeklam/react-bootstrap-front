import React from 'react';
import { shallow } from 'enzyme';
import { SearchCardLink } from '../../../src/features/trello';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<SearchCardLink />);
  expect(renderedComponent.find('.trello-search-card-link').length).toBe(1);
});
