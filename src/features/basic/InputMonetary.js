import React, { Component } from 'react';
import { IMaskInput } from 'react-imask';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getRandomInt } from '../helper';

export default class InputMonetary extends Component {
  static propTypes = {
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
    language: PropTypes.string,
    money: PropTypes.string,
    inputMoney: PropTypes.string,
    swapIcon: PropTypes.element,
    onMoneySwitch: PropTypes.func,
  };

  static defaultProps = {
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
    language: 'fr-FR',
    money: 'EUR',
    inputMoney: 'EUR',
    swapIcon: null,
    onMoneySwitch: null,
  };

  constructor(props) {
    super(props);
    const inputValue = parseFloat(this.props.value || '0', 10);
    this.state = {
      value: inputValue,
    };
  }

  render() {
    let myId = this.props.id;
    if (myId === '') {
      myId = this.props.name;
      const rnd = getRandomInt(10000, 99999);
      myId = `${myId}-${rnd}`;
    }
    const value = this.props.value || 0;
    return (
      <div
        className={classnames(
          'form-group',
          !this.props.labelTop && 'row',
          this.props.size && `form-group-${this.props.size}`,
        )}
      >
        {this.props.label !== '' && (
          <label
            htmlFor={myId}
            className={classnames(
              !this.props.labelTop && `col-xs-w${this.props.labelSize} col-form-label`,
              this.props.size && `col-form-label-${this.props.size}`
            )}
          >
            {this.props.label}
            {this.props.required && <span>&nbsp;*</span>}
          </label>
        )}
        <div className={classnames(!this.props.labelTop && `col-xs-w${this.props.inputSize}`)}>
          <div className="input-group">
            <IMaskInput
              className={classnames(
                'border-secondary form-control',
                this.props.size && `form-control-${this.props.size}`,
                (this.props.error || this.props.warning) && 'is-invalid',
              )}
              id={myId}
              name={this.props.name}
              value={value.toString().replace('.', ',')}
              required={this.props.required}
              disabled={this.props.disabled}
              onAccept={(val) => {
                const mnt = val.toString().replace(',', '.');
                const event = {
                  target: {
                    name: this.props.name,
                    value: mnt,
                  },
                };
                this.props.onChange(event);
              }}
              autoComplete={this.props.autoComplete}
              placeholder={this.props.placeholder}
              mask={Number}
              scale={2}
              signed={false}
              thousandsSeparator=""
              padFractionalZeros
              normalizeZeros={false}
              radix=","
              mapToRadix={['.']}
            />
            <div className="input-group-append">
              <span className="input-group-text border-secondary bg-light">
                {this.props.inputMoney}
              </span>
              {this.props.swapIcon &&
                <button
                  type="button"
                  disabled={this.props.disabled}
                  className={classnames(
                    'btn btn-input btn-outline-secondary bg-light',
                    this.props.size && `btn-${this.props.size}`,
                  )}
                  onClick={this.props.onMoneySwitch}
                >
                  {this.props.swapIcon}
                </button>
              }
            </div>
          </div>
          {this.props.error && <div className="invalid-feedback">{this.props.error}</div>}
          {this.props.warning && <div className="invalid-feedback">{this.props.warning}</div>}
        </div>
      </div>
    );
  }
}
