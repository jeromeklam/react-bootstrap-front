import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default function DropdownMenu(props) {
  return (
    <div className={classnames('dropdown-menu show', props.className)} style={{ position: 'relative' }}>
      {props.children}
    </div>
  );
}

DropdownMenu.propTypes = {
  className: PropTypes.string,
  children: PropTypes.element.isRequired,
};
DropdownMenu.defaultProps = {
  className: '',
};
