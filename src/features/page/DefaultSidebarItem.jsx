import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Highlight } from '../tour';

export const DefaultSidebarItem = props => (
  <li className={props.className}>
    <div className="sidebar-navigation-li bg-primary" />
    <a
      className={classnames(
        'nav-link',
        props.location.pathname === props.option.url ? 'active text-primary' : 'text-secondary'
      )}
      onClick={() => {
        props.onNavigate(props.option.url);
      }}
    >
      {props.option.icon}
      <span className="sidebar-menu-label">{props.option.label}</span>
      <Highlight position="right" theme="NAV" title={props.option.help || ''} />
    </a>
  </li>
);

DefaultSidebarItem.propTypes = {
  location: PropTypes.element.isRequired,
  option: PropTypes.element.isRequired,
  onNavigate: PropTypes.func.isRequired,
  className: PropTypes.string,
};

DefaultSidebarItem.defaultProps = {
  className: '',
};
