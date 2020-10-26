import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getRandomInt, randomString } from '../helper';

export const InputRandomText = (props) => {
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
            !props.labelTop && `col-xs-w${props.labelSize} col-form-label`,
            props.size && `col-form-label-${props.size}`
          )}
        >
          {props.label}
          {props.required && <span>&nbsp;*</span>}
        </label>
      )}
      <div className={classnames(!props.labelTop && `col-xs-w${props.inputSize}`)}>
        <div className={classnames('input-group')}>
          <input
            type="text"
            className={classnames(
              'border-secondary form-control',
              props.size && `form-control-${props.size}`
            )}
            id={myId}
            name={props.name}
            value={props.value || ''}
            required={props.required}
            disabled={props.disabled}
            onChange={props.onChange}
          />
          <div className="input-group-append">
            <button
              type="button"
              className={classnames('btn btn-input btn-outline-secondary bg-light')}
              onClick={() => {
                const event = {
                  target: {
                    name: props.name,
                    value: randomString(props.length),
                  },
                };
                props.onChange(event);
              }}
            >
              {props.randomIcon}
            </button>
            <button
              type="button"
              disabled={props.disabled}
              className={classnames(
                'btn btn-input btn-outline-secondary bg-light',
                props.size && `btn-${props.size}`,
              )}
              onClick={() => {
                const event = {
                  target: {
                    name: props.name,
                    value: '',
                  },
                };
                props.onChange(event);
              }}
            >
              {props.removeIcon}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

InputRandomText.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  length: PropTypes.number,
  labelTop: PropTypes.bool,
  size: PropTypes.string,
  labelSize: PropTypes.number,
  inputSize: PropTypes.number,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.element,
  warning: PropTypes.element,
  onChange: PropTypes.func,
  randomIcon: PropTypes.element.isRequired,
  removeIcon: PropTypes.element.isRequired,
};

InputRandomText.defaultProps = {
  id: '',
  label: '',
  value: '',
  length: 32,
  labelTop: true,
  size: null,
  labelSize: 6,
  inputSize: 30,
  required: false,
  disabled: false,
  error: false,
  warning: false,
  onChange: () => {},
};
