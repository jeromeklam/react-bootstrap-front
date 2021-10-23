import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getRandomInt, verifyEmail } from '../helpers';

export const InputEmail = props => {
  let myId = props.id;
  if (myId === '') {
    myId = props.name;
    const rnd = getRandomInt(10000, 99999);
    myId = `${myId}-${rnd}`;
  }
  return (
    <div className={classnames('form-group', !props.labelTop && 'row', props.size && `form-group-${props.size}`)}>
      {props.label !== '' && (
        <label
          htmlFor={myId}
          className={classnames(
            !props.labelTop && `col-xxs-w${props.labelSize} col-form-label`,
            props.size && `col-form-label-${props.size}`
          )}
        >
          {props.label}
          {props.required && <span>&nbsp;*</span>}
        </label>
      )}
      <div className={classnames(!props.labelTop && `col-xxs-w${props.inputSize}`)}>
        <div className={classnames('input-group', (props.error || props.warning || !verifyEmail(props.value)) && 'is-invalid')}>
          <input
            type="text"
            className={classnames(
              'border-rbf form-control',
              props.size && `form-control-${props.size}`,
              (props.error || props.warning || !verifyEmail(props.value)) && 'is-invalid'
            )}
            id={myId}
            name={props.name}
            value={props.value || ''}
            required={props.required}
            disabled={props.disabled}
            onChange={props.onChange}
            autoComplete={props.autoComplete}
            placeholder={props.placeholder}
          />
          {props.addHref && props.eMailIcon && props.eMailIcon !== '' && (
            <div className="input-group-append">
              <a
                type="button"
                href={props.value && `mailto:${props.value}`}
                className={classnames(
                  `btn btn-input btn-outline-rbf bg-light text-secondary`,
                  props.size && `btn-${props.size}`
                )}
              >
                {props.eMailIcon}
              </a>
            </div>
          )}
        </div>
        {props.error && <div className="invalid-feedback">{props.error}</div>}
        {props.warning && <div className="invalid-feedback">{props.warning}</div>}
      </div>
    </div>
  );
};

InputEmail.propTypes = {
  addHref: PropTypes.bool,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  labelTop: PropTypes.bool,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  size: PropTypes.string,
  labelSize: PropTypes.number,
  inputSize: PropTypes.number,
  borderColor: PropTypes.string,
  error: PropTypes.element,
  warning: PropTypes.element,
  autoComplete: PropTypes.string,
  placeholder: PropTypes.string,
  pattern: PropTypes.string,
  eMailIcon: PropTypes.element,
};

InputEmail.defaultProps = {
  addHref: true,
  labelTop: true,
  value: '',
  label: '',
  id: '',
  onChange: () => {},
  disabled: false,
  required: false,
  size: null,
  labelSize: 6,
  inputSize: 30,
  borderColor: 'secondary',
  error: false,
  warning: false,
  autoComplete: 'off',
  placeholder: '',
  pattern: '',
  eMailIcon: null,
};
