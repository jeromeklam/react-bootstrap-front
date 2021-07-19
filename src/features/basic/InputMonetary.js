import React from 'react';
import { IMaskInput } from 'react-imask';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { InputGroup, InputGroupAppend, InputGroupPrepend, InputGroupText } from './';
import { getRandomInt } from '../helpers';

export default function InputMonetary(props) {
  let myId = props.id;
  if (myId === '') {
    myId = props.name;
    const rnd = getRandomInt(10000, 99999);
    myId = `${myId}-${rnd}`;
  }
  const value = props.value || 0;
  return (
    <InputGroup {...props} id={myId}>
      {props.prepend && props.prepend !== '' && (
        <InputGroupPrepend>
          <InputGroupText className="border-secondary bg-light">{props.prepend}</InputGroupText>
        </InputGroupPrepend>
      )}
      <IMaskInput
        className={classnames(
          'border-secondary form-control',
          props.size && `form-control-${props.size}`,
          (props.error || props.warning) && 'is-invalid'
        )}
        id={myId}
        name={props.name}
        value={value.toString().replace('.', ',')}
        required={props.required}
        disabled={props.disabled || props.locked}
        onAccept={val => {
          const mnt = val.toString().replace(',', '.');
          const event = {
            target: {
              name: props.name,
              value: mnt,
            },
          };
          props.onChange(event);
        }}
        autoComplete={props.autoComplete}
        placeholder={props.placeholder}
        mask={Number}
        scale={2}
        signed={false}
        thousandsSeparator=""
        padFractionalZeros
        normalizeZeros={false}
        radix=","
        mapToRadix={['.']}
      />
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
        {props.onMoneySwitch && (
          <button
            type="button"
            disabled={props.disabled || props.locked}
            className={classnames('btn btn-input btn-outline-secondary bg-light', props.size && `btn-${props.size}`)}
            onClick={props.onMoneySwitch}
          >
            {props.inputMoney} {props.swapIcon}
          </button>
        )}
        <InputGroupText className="border-secondary bg-light">
          {props.onMoneySwitch ? props.rateValue : props.inputMoney}
        </InputGroupText>
      </InputGroupAppend>
    </InputGroup>
  );
}

InputMonetary.propTypes = {
  autoComplete: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.element,
  id: PropTypes.string,
  inputMoney: PropTypes.string,
  inputSize: PropTypes.number,
  label: PropTypes.string,
  labelSize: PropTypes.number,
  labelTop: PropTypes.bool,
  language: PropTypes.string,
  locked: PropTypes.bool,
  lockOffIcon: PropTypes.element,
  lockOnIcon: PropTypes.element,
  money: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onLockOn: PropTypes.func,
  onLockOff: PropTypes.func,
  onMoneySwitch: PropTypes.func,
  pattern: PropTypes.string,
  placeholder: PropTypes.string,
  rateValue: PropTypes.string,
  required: PropTypes.bool,
  size: PropTypes.string,
  swapIcon: PropTypes.element,
  value: PropTypes.string,
  warning: PropTypes.element,
};

InputMonetary.defaultProps = {
  autoComplete: 'off',
  disabled: false,
  error: false,
  id: '',
  inputMoney: 'EUR',
  inputSize: 30,
  label: '',
  labelSize: 6,
  labelTop: true,
  language: 'fr-FR',
  locked: false,
  lockOffIcon: null,
  lockOnIcon: null,
  money: 'EUR',
  onChange: () => {},
  onLockOn: null,
  onLockOff: null,
  onMoneySwitch: null,
  pattern: null,
  placeholder: '',
  rateValue: '',
  required: false,
  size: null,
  swapIcon: null,
  value: '',
  warning: false,
};
