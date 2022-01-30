import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { InputGroup, InputGroupAppend, InputGroupPrepend, InputGroupText } from './';
import { getFieldId } from '../helpers';

export const InputText = props => {
  let myId = getFieldId(props.name, props.id);
  return (
    <InputGroup {...props} id={myId}>
      {props.prepend && props.prepend !== '' && (
        <InputGroupPrepend>
          <InputGroupText className="border-rbf bg-light">{props.prepend}</InputGroupText>
        </InputGroupPrepend>
      )}
      <input
        type="text"
        className={classnames(
          'border-rbf form-control',
          props.size && `form-control-${props.size}`,
          (props.error || props.warning) && 'is-invalid',
          props.className && props.className
        )}
        id={myId}
        name={props.name}
        value={props.value === null ? '' : props.value}
        required={props.required}
        disabled={props.disabled || props.locked}
        onBlur={props.onBlur}
        onChange={props.onChange}
        pattern={props.pattern}
        autoComplete={props.autoComplete}
        placeholder={props.placeholder}
        maxLength={props.maxLength || ''}
      />
      <InputGroupAppend>
        {props.onLockOn !== null && props.onLockOff !== null && (
          <button
            type="button"
            disabled={props.disabled}
            className={classnames(`btn btn-input btn-outline-rbf bg-light`, props.size && `btn-${props.size}`)}
            onClick={props.locked ? () => props.onLockOff(props.name) : () => props.onLockOn(props.name)}
          >
            {props.locked ? props.lockOnIcon : props.lockOffIcon}
          </button>
        )}
        {props.append && props.append !== '' && (
          <InputGroupText className="border-rbf bg-light">{props.append}</InputGroupText>
        )}
      </InputGroupAppend>
    </InputGroup>
  );
};

InputText.propTypes = {
  append: PropTypes.element,
  autoComplete: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.element,
  id: PropTypes.string,
  maxLength: PropTypes.number,
  name: PropTypes.string.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  pattern: PropTypes.string,
  placeholder: PropTypes.string,
  prepend: PropTypes.element,
  required: PropTypes.bool,
  size: PropTypes.string,
  value: PropTypes.string,
  warning: PropTypes.element,
  locked: PropTypes.bool,
  lockOffIcon: PropTypes.element,
  lockOnIcon: PropTypes.element,
  onLockOn: PropTypes.func,
  onLockOff: PropTypes.func,
};

InputText.defaultProps = {
  append: null,
  autoComplete: 'off',
  className: '',
  disabled: false,
  error: false,
  id: '',
  maxLength: 9999,
  onBlur: () => {},
  onChange: () => {},
  pattern: null,
  placeholder: '',
  prepend: null,
  required: false,
  size: null,
  value: '',
  warning: false,
  locked: false,
  lockOffIcon: null,
  lockOnIcon: null,
  onLockOn: null,
  onLockOff: null,
};
