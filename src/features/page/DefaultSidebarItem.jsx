import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Highlight } from '../tour';

export const DefaultSidebarItem = props => (
  <li className={props.className}>
    <div className="sidebar-navigation-li bg-primary" />
    <a onClick={() => props.onNavigate(props.option.url)}
      className={classnames(
        'nav-link',
        props.location.pathname === props.option.url ? 'active text-primary' : 'text-secondary'
      )}
      
      title={(!props.open && props.option.label) && props.option.label} 
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
  open: PropTypes.bool,
};

DefaultSidebarItem.defaultProps = {
  className: '',
  open: true,
};
