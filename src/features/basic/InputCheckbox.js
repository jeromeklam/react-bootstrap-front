import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const switchstyle = {
  position: 'relative',
  display: 'inline-block',
  width: '60px',
  height: '30px',
  marginBottom: '0px',
  top: '3px',
  transition: '0.4s',
  borderRadius: '30px',
  border: '1px solid',
};

const sliderstyle = {
  position: 'absolute',
  cursor: 'pointer',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  transition: '0.4s',
  borderRadius: '30px',
};
const slideronstyle = {
  ...sliderstyle,
  transform: 'translateX(30px)',
};

const sliderbeforestyle = {
  content: '',
  position: 'absolute',
  height: '24px',
  width: '24px',
  left: '3px',
  bottom: '2px',
  transition: '0.4s',
  borderRadius: '50%',
};

const sliderdetailstyle = {
  marginLeft: '10px',
  top: '-7px',
  position: 'relative',
};

const inputstyle = {
  display: 'none',
};

export const InputCheckbox = props => (
  <div className={classnames('ui-input-checkbox form-group', !props.labelTop && 'row')}>
    {props.label !== '' && (
      <label htmlFor={props.id} className={classnames(!props.labelTop && `col-xs-w${props.labelSize} col-form-label`)}>
        {props.label}
        {props.required && <span>&nbsp;*</span>}
      </label>
    )}
    <div className={classnames(!props.labelTop && `col-xs-w${props.inputSize}`)}>
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
      {props.detail && <span style={sliderdetailstyle}>{props.detail}</span>}
    </div>
  </div>
);

InputCheckbox.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  detail: PropTypes.element,
  checked: PropTypes.bool,
  labelTop: PropTypes.bool,
  labelSize: PropTypes.number,
  inputSize: PropTypes.number,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
};

InputCheckbox.defaultProps = {
  labelTop: true,
  checked: false,
  label: '',
  id: '',
  detail: '',
  labelSize: 6,
  inputSize: 30,
  onChange: () => {},
  disabled: false,
  required: false,
};
