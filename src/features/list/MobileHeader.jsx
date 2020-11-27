import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const mystyle = {
  position: 'fixed',
  top: '0px',
  left: '0px',
  right: '0px',
  height: '50px',
  zIndex: '700',
};

export const MobileHeader = props => (
  <div style={mystyle} className="row row-short bg-secondary text-light">
    <div className="col-xs-w20">
      <h4 className="pl-2 pt-1">{props.title}</h4>
    </div>
    <div className="col-xs-w16 text-right">
      <ul className="nav justify-content-end">
        {props.globalActions &&
          props.globalActions.map(action => (
            <li className="nav-item" key={action.name}>
              <button
                type="button"
                title={action.label || ''}
                className={classnames('btn', action.theme && `btn-${action.theme}`)}
                onClick={() => {
                  action.onClick();
                }}
              >
                {action.icon}
              </button>
            </li>
          ))}
      </ul>
    </div>
  </div>
);

MobileHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onReload: PropTypes.func.isRequired,
  globalActions: PropTypes.element,
};

MobileHeader.defaultProps = {
  globalActions: [],
};
