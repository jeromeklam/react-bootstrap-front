import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Highlight } from '../tour';

export const DefaultSidebarMenu = props => (
  <li className={classnames("sidebar-menu",  props.className)}>
    <div className="sidebar-navigation-menu sidebar-navigation-li bg-primary" />
    <a
      className={classnames(
        'nav-link',
        props.menu === props.option.position ? 'active text-secondary' : 'text-secondary'
      )}
      onClick={() => {
        props.toggleMenu(props.option.position);
      }}
      title={(!props.open && props.option.label && props.option.label) || ''}
    >
      <Highlight position="right" theme="NAV" title={props.option.help || ''}>
        {props.option.icon}
        <span className="sidebar-menu-label text secondary no-selector">{props.option.label}</span>
        <div className="sidebar-menu-arrow">
          {props.menuIsOpen(props.option.position) ? props.menuOpened : props.menuClosed}
        </div>
      </Highlight>
    </a>
  </li>
);

DefaultSidebarMenu.propTypes = {
  location: PropTypes.element.isRequired,
  option: PropTypes.element.isRequired,
  toggleMenu: PropTypes.func.isRequired,
  menu: PropTypes.number.isRequired,
  open: PropTypes.bool,
};

DefaultSidebarMenu.defaultProps = {
  open: true,
};
