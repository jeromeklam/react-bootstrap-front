import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export const InlineLabel = props => (
  <label htmlFor={props.htmlFor} className={classnames('col-form-label', props.size && `col-form-label-${props.size}`)}>
    {props.label}
  </label>
);

InlineLabel.propTypes = {
  label: PropTypes.string.isRequired,
  size: PropTypes.string,
  htmlFor: PropTypes.string,
};

InlineLabel.defaultProps = {
  size: null,
};
