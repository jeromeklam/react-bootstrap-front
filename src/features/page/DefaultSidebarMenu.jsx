import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './DefaultSidebar.css';

export const DefaultSidebarMenu = props => (
  <li className="sidebar-menu">
    <div className="sidebar-navigation-menu sidebar-navigation-li bg-primary" />
    <a
      className={classnames(
        'nav-link',
        props.menu === props.option.position ? 'active text-secondary' : 'text-secondary'
      )}
      onClick={() => {
        props.toggleMenu(props.option.position);
      }}
      title={(!props.open && props.option.label) && props.option.label}
    >
      {props.option.icon}
      {props.open && (
        <span className="sidebar-menu-label text secondary">{props.option.label}</span>
      )}
      <div
        className={classnames(
          props.open ? 'sidebar-menu-arrow-open' : 'sidebar-menu-arrow',
          props.menu === props.option.position ? 'active text-secondary' : 'text-secondary',
        )}
      >
        {props.menu === props.option.position ? props.menuOpened : props.menuClosed }
      </div>
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

