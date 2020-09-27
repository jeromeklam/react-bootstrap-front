import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const headerStyles = {
  position: 'absolute',
  top: '0px',
  left: '0px',
  right: '0px',
  bottom: '0px',
};

const navLinkStyles = {
  padding: '0rem 0.5rem',
};

export const MobileHeader = props => (
  <header className="mobile-header w-100 bg-secondary text-light" style={headerStyles}>
    <div className="row">
      <div className="col-20">
        <span className="header-title pl-2">{props.title}</span>
      </div>
      <div className="col-16 text-right">
        <ul className="nav justify-content-end">
          {props.options.map((option) => {
            if (
              option.role === 'HOME' ||
              (option.role === 'SIGNIN' && !props.authenticated) ||
              (option.role === 'SIGNOUT' && props.authenticated)
            ) {
              return (
                <li className="nav-item">
                  <a
                    className={classnames('nav-link', props.location.pathname === option.url && 'active')}
                    onClick={() => {
                      props.onNavigate(option.url);
                    }}
                    style={navLinkStyles}
                  >
                    <span>{option.icon}</span>
                  </a>
                </li>
              );
            }
            return null;
          })}
        </ul>
      </div>
    </div>
  </header>
);

MobileHeader.propTypes = {
  title: PropTypes.func.isRequired,
  options: PropTypes.element.isRequired,
  onToggleSide: PropTypes.func,
  authenticated: PropTypes.bool.isRequired,
  location: PropTypes.element.isRequired,
  onNavigate: PropTypes.func.isRequired,
  menuIcon: PropTypes.element,
};

MobileHeader.defaultProps = {
  onToggleSide: null,
  menuIcon: null,
};
