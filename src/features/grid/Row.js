import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default function Row(props) {
  return <div {...props} className={classnames('row', props.className)}>{props.children}</div>;
}

Row.propTypes = {
  children: PropTypes.element,
};
Row.defaultProps = {
  children: null,
};
