import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Highlight } from '../tour';

export const DefaultSidebarItem = props => (
  <li className={props.className}>
    <div className="sidebar-navigation-li bg-primary" />
    <a
      href={props.option.url}
      onClick={e => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        props.onNavigate(props.option.url);
      }}
      className={classnames(
        'nav-link',
        props.location.pathname === props.option.url ? 'active text-primary' : 'text-secondary'
      )}
      title={(!props.open && props.option.label && props.option.label) || ''}
    >
      <Highlight position="right" theme="NAV" title={props.option.help || ''}>
        {props.option.icon}
        <span className="sidebar-menu-label">{props.option.label}</span>
      </Highlight>
    </a>
  </li>
);

DefaultSidebarItem.propTypes = {
  className: PropTypes.string,
  location: PropTypes.element.isRequired,
  onNavigate: PropTypes.func.isRequired,
  open: PropTypes.bool,
  option: PropTypes.element.isRequired,
};

DefaultSidebarItem.defaultProps = {
  className: '',
  open: true,
};
