import React from 'react';
import PropTypes from 'prop-types';

const cardStyles = {
  position: 'absolute',
  top: '0px',
  bottom: '0px',
  left: '0px',
  right: '0px',
  border: '0px',
};

const cardBodyStyles = {
  overflowX: 'hidden',
  overflowY: 'auto',
};

const cardHeaderStyles = {
  height: '40px',
  lineHeight: '40px',
  borderRadius: '0px',
  padding: '0px',
  paddingLeft: '5px',
};

const navStyles = {
  position: 'absolute',
  top: '0px',
  right: '5px',
};

export const MobileForm = props => (
  <form className="layout-form-responsive">
    <div className="card bg-light" style={cardStyles}>
      <div className="card-header mobile-navbar bg-secondary text-light" style={cardHeaderStyles}>
        <span className="justify-content-start">{props.title}</span>
        <ul className="nav justify-content-end" style={navStyles}>
          {props.tabs &&
            props.tabs.map(oneTab => (
              <li key={oneTab.key} className="nav-item tab-item">
                <button
                  type="button"
                  onClick={() => {
                    props.onNavTab(oneTab.key);
                  }}
                >
                  {oneTab.icon}
                </button>
              </li>
            ))}
          <li className="nav-item tab-item-action">
            <button type="button" className="btn btn-success btn-submit" onClick={props.onSubmit}>
              {props.validIcon}
            </button>
          </li>
          <li className="nav-item tab-item-action">
            <button type="button" className="btn btn-secondary" onClick={props.onCancel}>
              {props.cancelIcon}
            </button>
          </li>
        </ul>
      </div>
      <div className="card-body" style={cardBodyStyles}>{props.children}</div>
    </div>
  </form>
);

MobileForm.propTypes = {
  title: PropTypes.string.isRequired,
  tabs: PropTypes.element,
  validIcon: PropTypes.element.isRequired,
  cancelIcon: PropTypes.element.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  children: PropTypes.node,
};

MobileForm.defaultProps = {
  tabs: [],
  children: null,
};
