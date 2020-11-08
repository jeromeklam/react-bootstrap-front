import React from 'react';
import { shallow } from 'enzyme';
import { CardMenu } from '../../../src/features/trello';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<CardMenu />);
  expect(renderedComponent.find('.trello-card-menu').length).toBe(1);
});
