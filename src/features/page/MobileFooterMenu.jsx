import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const mystyle = {
  position: 'absolute',
  bottom: '0',
  width: '100%',
  height: '100%',
  zIndex: '800',
};

const navLinkStyles = {
  padding: '0',
};

export const MobileFooterMenu = props => (
  <div style={mystyle} className="bg-secondary text-light">
    <div className="container h-100">
      <div className="mobile-footer-menu row text-center flex-nowrap h-100">
        <div className="mobile-footer-option col-xs-w10 text-center">
          <a href="#" className="nav-link text-light btn-humburger" onClick={props.onInitMenu} id="menu-toggle">
            {props.menuIcon}
            <br />
            <span className="mobile-footer-option-label">Menu</span>
          </a>
        </div>
        {props.options.map(option => {
          if (
            option.role === 'HOME' ||
            (option.role === 'NAV' && (props.authenticated || (props.authenticated && option.public)))
          ) {
            return (
              <div key={`${option.label}-${option.url}`} className="mobile-footer-option col-xs-w10 text-center">
                <a
                  href={option.url}
                  className={classnames('nav-link text-light', props.location.pathname === option.url && 'active')}
                  onClick={evt => {
                    if (evt) {
                      evt.preventDefault();
                      evt.stopPropagation();
                    }
                    props.onCloseMenu();
                    props.onNavigate(option.url);
                  }}
                  style={navLinkStyles}
                >
                  {option.icon}
                  <br />
                  <span className="mobile-footer-option-label">{option.label}</span>
                </a>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  </div>
);

MobileFooterMenu.propTypes = {
  options: PropTypes.element.isRequired,
  authenticated: PropTypes.bool.isRequired,
  location: PropTypes.element.isRequired,
  onNavigate: PropTypes.func.isRequired,
};
