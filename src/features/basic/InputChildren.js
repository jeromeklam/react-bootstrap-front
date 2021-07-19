import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup, InputGroupAppend, InputGroupPrepend, InputGroupText } from './';
import { getFieldId } from '../helpers';

export const InputChildren = props => {
  let myId = getFieldId(props.name, props.id);
  return (
    <InputGroup {...props} id={myId}>
      {props.prepend && props.prepend !== '' && (
        <InputGroupPrepend>
          <InputGroupText className="border-secondary bg-light">{props.prepend}</InputGroupText>
        </InputGroupPrepend>
      )}
      {props.children}
      {props.append && props.append !== '' && (
        <InputGroupAppend>
          <InputGroupText className="border-secondary bg-light">{props.append}</InputGroupText>
        </InputGroupAppend>
      )}
    </InputGroup>
  );
};

InputChildren.propTypes = {
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

InputChildren.defaultProps = {
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
