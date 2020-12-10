import React from 'react';
import PropTypes from 'prop-types';
import uuidv1 from 'uuid/v1';

export default function SvgCheckbox(props) {
  let otherProps = { checked: false };
  if ((props.checked && props.checked === true) || (props.selected && props.selected === true)) {
    otherProps.checked = 'checked';
  }
  const id = 'cbx-' + uuidv1();
  return (
    <div className="basic-svg-checkbox">
      <label htmlFor={id} className="label-cbx" onClick={props.onChange}>
        <input
          type="checkbox"
          class="invisible"
          {...otherProps}
          onChange={ev => {
            ev.preventDefault();
          }}
        />
        <div className="checkbox" style={{ width: '16px', height: '16px' }}>
          <svg width="16px" height="16px" viewBox="0 0 20 20">
            <path
              id="basic-svg-checkbox-out"
              d="M3,1 L17,1 L17,1 C18.1045695,1 19,1.8954305 19,3 L19,17 L19,17 C19,18.1045695 18.1045695,19 17,19 L3,19 L3,19 C1.8954305,19 1,18.1045695 1,17 L1,3 L1,3 C1,1.8954305 1.8954305,1 3,1 Z"
              stroke="black"
              fill="white"
            />
            <path
              id="basic-svg-checkbox-inner"
              d="M 5.334 4 L 14.666 4 L 14.666 4 C 15.403 4 16 4.597 16 5.334 L 16 14.666 L 16 14.666 C 16 15.403 15.403 16 14.666 16 L 5.334 16 L 5.334 16 C 4.597 16 4 15.403 4 14.666 L 4 5.334 L 4 5.334 C 4 4.597 4.597 4 5.334 4 Z"
              stroke="black"
              fill="black"
            />
          </svg>
        </div>
      </label>
    </div>
  );
}

SvgCheckbox.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.bool,
};
SvgCheckbox.defaultProps = {
  checked: false,
  selected: false,
};
