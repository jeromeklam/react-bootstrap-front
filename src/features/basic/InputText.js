import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { InputGroup, InputGroupAppend, InputGroupPrepend, InputGroupText } from './';
import { getFieldId } from '../helper';

export const InputText = props => {
  let myId = getFieldId(props.name, props.id);
  return (
    <InputGroup {...props} id={myId}>
      {props.prepend && props.prepend !== '' && (
        <InputGroupPrepend>
          <InputGroupText className="border-secondary bg-light">{props.prepend}</InputGroupText>
        </InputGroupPrepend>
      )}
      <input
        type="text"
        className={classnames(
          'border-secondary form-control',
          props.size && `form-control-${props.size}`,
          (props.error || props.warning) && 'is-invalid',
          props.className && props.className
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
      {props.append && props.append !== '' && (
        <InputGroupAppend>
          <InputGroupText className="border-secondary bg-light">{props.append}</InputGroupText>
        </InputGroupAppend>
      )}
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
  onChange: PropTypes.func,
  pattern: PropTypes.string,
  placeholder: PropTypes.string,
  prepend: PropTypes.element,
  required: PropTypes.bool,
  size: PropTypes.string,
  value: PropTypes.string,
  warning: PropTypes.element,
};

InputText.defaultProps = {
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
};
