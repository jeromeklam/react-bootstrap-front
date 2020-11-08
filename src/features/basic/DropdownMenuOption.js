import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default function DropdownMenuOption(props) {
  return (
    <button className={classnames('dropdown-item', props.theme && `text-${props.theme}`)} onClick={props.onClick}>
      {props.label}
    </button>
  );
}

DropdownMenuOption.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  theme: PropTypes.string,
};
DropdownMenuOption.defaultProps = {
  theme: null,
};
