import React from 'react';
import renderer from 'react-test-renderer';
import { DropdownWrapper } from '../../../src/features/advanced';

it('renders standard', () => {
  // First render
  const component = renderer.create(
    <DropdownWrapper trigger={<button>Button</button>}>
      <span>TEST</span>
    </DropdownWrapper>
  );
  let test = component.toJSON();
  expect(test).toMatchSnapshot();
});

it('renders test onClick', () => {
  // First render
  let component;
  renderer.act(() => {
    component = renderer.create(
      <DropdownWrapper trigger={<button>Button</button>}>
        <span>TEST</span>
      </DropdownWrapper>
    );
  });
  // Exprime des attentes sur la racine
  expect(component.toJSON()).toMatchSnapshot();

  const trigger = component.root.findByProps({ className: 'advanced-dropdown-wrapper' });
  expect(trigger.props.onClick).toBeInstanceOf(Function);

  renderer.act(() => trigger.props.onClick());
  expect(component.toJSON()).toMatchSnapshot();
});
