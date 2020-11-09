import React from 'react';
import PropTypes from 'prop-types';

export default function SvgCheckbox(props) {
  let otherProps = {};
  if (props.selected) {
    otherProps.checked = 'checked';
  }
  return (
    <div className="basic-svg-checkbox">
      <label for="cbx" className="label-cbx" onClick={props.onChange}>
        <input id="cbx" type="checkbox" class="invisible" {...otherProps} />
        <div className="checkbox" style={{width: '16px', height: '16px'}}>
          <svg width="16px" height="16px" viewBox="0 0 20 20">
            <path d="M3,1 L17,1 L17,1 C18.1045695,1 19,1.8954305 19,3 L19,17 L19,17 C19,18.1045695 18.1045695,19 17,19 L3,19 L3,19 C1.8954305,19 1,18.1045695 1,17 L1,3 L1,3 C1,1.8954305 1.8954305,1 3,1 Z" />
            <polyline points="4 11 8 15 16 6" />
          </svg>
        </div>
      </label>
    </div>
  );
}

SvgCheckbox.propTypes = {
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.bool,
};
SvgCheckbox.defaultProps = {
  selected: false,
};
