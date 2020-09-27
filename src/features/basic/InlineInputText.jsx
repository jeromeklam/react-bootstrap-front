import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export const InlineInputText = props => (
  <div>
    <input
      type="text"
      className={classnames(
        'form-control border-secondary',
        props.size && `form-control-${props.size}`,
        props.error && 'is-invalid',
      )}
      id={props.id}
      name={props.name}
      value={props.value || ''}
      required={props.required}
      disabled={props.disabled}
      onChange={props.onChange}
      pattern={props.pattern}
      placeholder={props.placeholder}
    />
    {props.error && <div className="invalid-feedback">{props.error}</div>}
  </div>
);

InlineInputText.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  size: PropTypes.string,
  error: PropTypes.element,
  placeholder: PropTypes.string,
  pattern: PropTypes.string,
};

InlineInputText.defaultProps = {
  value: '',
  id: '',
  onChange: () => {},
  disabled: false,
  required: false,
  size: null,
  error: null,
  placeholder: '',
  pattern: '',
};
