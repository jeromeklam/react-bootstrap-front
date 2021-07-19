import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export const ColLink = props => (
  <div
    className={classnames('col-xs-w36 text-center', props.onClick && 'col-link', props.className)}
    onClick={props.onClick}
  >
    <span className="col-link-label">{props.label}</span>
  </div>
);

ColLink.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func,
};

ColLink.defaultProps = {
  className: 'text-secondary',
  label: 'Plus',
  onClick: null,
};