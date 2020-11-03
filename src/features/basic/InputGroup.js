import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { colSizeAsClassName } from '../grid';

export default function InputGroup(props) {
  return (
    <div className={classnames('form-group', !props.labelTop && 'row', props.size && `form-group-${props.size}`)}>
      {props.label && props.label !== '' && (
        <label
          htmlFor={props.id}
          className={classnames(
            !props.labelTop && `col-form-label`,
            !props.labelTop && colSizeAsClassName(props.labelSize),
            props.size && `col-form-label-${props.size}`
          )}
        >
          {props.label}
          {props.required && <span>&nbsp;*</span>}
        </label>
      )}
      <div className={classnames(!props.labelTop && colSizeAsClassName(props.inputSize))}>
        <div className={classnames('input-group', (props.error || props.warning) && 'is-invalid')}>
          {props.children}
        </div>
        {props.help && props.help !== '' && <small className="form-text text-muted">{props.help}</small>}
        {props.error && <div className="invalid-feedback">{props.error}</div>}
        {props.warning && <div className="invalid-feedback">{props.warning}</div>}
      </div>
    </div>
  );
}

InputGroup.propTypes = {
  children: PropTypes.element,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.element]),
  help: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.element]),
  id: PropTypes.string,
  label: PropTypes.string,
  labelSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  labelTop: PropTypes.bool,
  required: PropTypes.bool,
  warning: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.element]),
};
InputGroup.defaultProps = {
  children: null,
  error: false,
  help: null,
  id: null,
  label: '',
  labelSize: '6',
  inputSize: '30',
  labelTop: true,
  required: false,
  warning: false,
};
