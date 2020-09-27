import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getRandomInt } from '../helper';

export const InputText = (props) => {
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
            !props.labelTop && `col-sm-${props.labelSize} col-form-label`,
            props.size && `col-form-label-${props.size}`
          )}
        >
          {props.label}
          {props.required && <span>&nbsp;*</span>}
        </label>
      )}
      <div className={classnames(!props.labelTop && `col-sm-${props.inputSize}`)}>
        <div className={classnames('input-group', (props.error || props.warning) && 'is-invalid')}>
          <input
            type="text"
            className={classnames(
              'border-secondary form-control',
              props.size && `form-control-${props.size}`,
              (props.error || props.warning) && 'is-invalid',
              props.className && props.className,
            )}
            id={myId}
            name={props.name}
            value={props.value || ''}
            required={props.required}
            disabled={props.disabled}
            onChange={props.onChange}
            pattern={props.pattern}
            autoComplete={props.autoComplete}
            placeholder={props.placeholder}
            maxLength={props.maxLength || ''}
          />
          {props.append !== '' &&
            <div className="input-group-append">
              <span className="input-group-text border-secondary bg-light">
                {props.append}
              </span>
            </div>
          }
        </div>
        {props.help && props.help !== '' && (
          <small className="form-text text-muted">
            {props.help}
          </small>
        )}
        {props.error && <div className="invalid-feedback">{props.error}</div>}
        {props.warning && <div className="invalid-feedback">{props.warning}</div>}
      </div>
    </div>
  );
};

InputText.propTypes = {
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
  error: PropTypes.element,
  warning: PropTypes.element,
  autoComplete: PropTypes.string,
  placeholder: PropTypes.string,
  pattern: PropTypes.string,
  className: PropTypes.string,
  maxLength: PropTypes.number,
  append: PropTypes.string,
  prepend: PropTypes.string,
  help: PropTypes.string,
};

InputText.defaultProps = {
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
  error: false,
  warning: false,
  autoComplete: 'off',
  placeholder: '',
  pattern: null,
  className: '',
  maxLength: 9999,
  append: '',
  prepend: '',
  help: '',
};
