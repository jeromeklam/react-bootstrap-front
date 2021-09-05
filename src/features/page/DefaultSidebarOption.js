import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { DefaultSidebarItem, DefaultSidebarMenu, DefaultSidebarOption as SidebarOptionChildren } from './';

export default function DefaultSidebarOption(props) {
  let label = '' + (props.option.url || props.option.position || '');
  label = label.replace(/\//gi, '-');
  if (
    props.option.role === 'HOME' ||
    props.option.role === 'ABOUT' ||
    (props.option.role === 'NAV' &&
      (props.authenticated || (props.authenticated && props.option.public)))
  ) {
    return (
      <DefaultSidebarItem
        key={`option-${label}-${props.option.position}`}
        {...props}
        option={props.option}
        open={props.open}
        className={classnames(props.menuOption, "menu-option", `option-level-${props.level}`)}
      />
    );
  } else if (
    props.option.role === 'MENU' &&
    (props.authenticated || (props.authenticated && props.option.public))
  ) {
    return (
      <div key={`option-${label}-${props.option.position}`}>
        <DefaultSidebarMenu
          toggleMenu={props.toggleMenu}
          {...props}
          option={props.option}
          menu={props.menu}
          open={props.open}
          className={classnames(props.menuOption, "menu-option", `option-level-${props.level}`)}
        />
        {props.open &&
          props.menuIsOpen(props.option.position) &&
          props.option.options.map(option => {
            return <SidebarOptionChildren {...props}  menuOption={true} option={option} level={props.level + 1}/>;
          })}
      </div>
    );
  }
  return null;
}

DefaultSidebarOption.propTypes = {
  menuOption: PropTypes.bool,
};
DefaultSidebarOption.defaultProps = {
  menuOption: false,
};
