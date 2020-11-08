import React from 'react';
import PropTypes from 'prop-types';

export default function DropdownMenuHeader(props) {
  return (
    <h6 className="dropdown-header">{props.label}</h6>
  );
};

DropdownMenuHeader.propTypes = {
  label: PropTypes.string.isRequired,
};
DropdownMenuHeader.defaultProps = {};
