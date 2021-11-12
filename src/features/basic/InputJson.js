import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ReactJson from 'react-json-view';
import { InputGroup, InputGroupAppend, InputGroupPrepend, InputGroupText } from './';
import { getFieldId } from '../helpers';

export const InputJson = props => {
  let myId = getFieldId(props.name, props.id);
  const data = JSON.parse(props.value) || {};
  console.log(data, props.value);
  return (
    <InputGroup {...props} id={myId}>
      {props.prepend && props.prepend !== '' && (
        <InputGroupPrepend>
          <InputGroupText className="border-secondary bg-light">{props.prepend}</InputGroupText>
        </InputGroupPrepend>
      )}
      <div
        className={classnames(
          'rbf-input-json border-secondary form-control',
          props.size && `form-control-${props.size}`,
          (props.error || props.warning) && 'is-invalid',
          props.className && props.className
        )}
      >
        <ReactJson displayObjectSize={false} displayDataTypes={false} quotesOnKeys={false} src={data} />
      </div>
      <InputGroupAppend>
        {props.onLockOn !== null && props.onLockOff !== null && (
          <button
            type="button"
            disabled={props.disabled}
            className={classnames(`btn btn-input btn-outline-secondary bg-light`, props.size && `btn-${props.size}`)}
            onClick={props.locked ? () => props.onLockOff(props.name) : () => props.onLockOn(props.name)}
          >
            {props.locked ? props.lockOnIcon : props.lockOffIcon}
          </button>
        )}
        {props.append && props.append !== '' && (
          <InputGroupText className="border-secondary bg-light">{props.append}</InputGroupText>
        )}
      </InputGroupAppend>
    </InputGroup>
  );
};

InputJson.propTypes = {
  append: PropTypes.element,
  autoComplete: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.element,
  id: PropTypes.string,
  maxLength: PropTypes.number,
  name: PropTypes.string.isRequired,
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

InputJson.defaultProps = {
  append: null,
  autoComplete: 'off',
  className: '',
  disabled: false,
  error: false,
  id: '',
  maxLength: 9999,
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
