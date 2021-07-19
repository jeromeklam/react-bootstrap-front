import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const switchstyle = {
  position: 'relative',
  display: 'inline-block',
  width: '52px',
  height: '26px',
  marginBottom: '0px',
  top: '3px',
  transition: '0.4s',
  borderRadius: '26px',
  border: '1px solid #ced4da',
};

const sliderstyle = {
  position: 'absolute',
  cursor: 'pointer',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  transition: '0.4s',
  borderRadius: '26px',
};
const slideronstyle = {
  ...sliderstyle,
  transform: 'translateX(26px)',
};

const sliderbeforestyle = {
  content: '',
  position: 'absolute',
  height: '20px',
  width: '20px',
  left: '3px',
  bottom: '2px',
  transition: '0.4s',
  borderRadius: '50%',
};

const sliderlabel = {
  left: '66px',
  top: '2px',
  position: 'absolute',
};

const inputstyle = {
  display: 'none',
};

export const InlineInputCheckbox = props => (
  <div className="ui-inline-input-checkbox" >
    <label style={switchstyle} className={classnames('bg-white', props.disabled ? 'border-secondary-light' : 'border-secondary')}>
      <input
        style={inputstyle}
        type="checkbox"
        className="form-check-input primary"
        id={props.id}
        name={props.name}
        required={props.required}
        disabled={props.disabled}
        onChange={props.onChange}
        checked={props.checked || false}
      />
      <div style={sliderbeforestyle}>
        <span
          style={props.checked === true ? slideronstyle : sliderstyle}
          className={classnames('ui-slide', props.checked === true ? 'bg-secondary' : 'bg-light')}
        />
      </div>
    </label>
    <span style={sliderlabel}>{props.label}</span>
  </div>
);

InlineInputCheckbox.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  size: PropTypes.string,
  label: PropTypes.string,
};

InlineInputCheckbox.defaultProps = {
  checked: false,
  id: '',
  onChange: () => {},
  disabled: false,
  required: false,
  size: null,
  label: '',
};
