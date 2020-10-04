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
    >
      {props.option.icon}
      <span className="sidebar-menu-label text secondary">{props.option.label}</span>
      <div
        className={classnames(
          'sidebar-menu-arrow',
          props.menu === props.option.position ? 'active text-primary' : 'text-secondary'
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
};
