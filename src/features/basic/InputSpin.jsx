import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const getValue = (minValue, maxValue, value, defaultMin = false) => {
  if (value === null) {
    return null;
  }
  let ret = defaultMin ? minValue : maxValue;
  if (value && value >= minValue && value <= maxValue) {
    ret = value;
  }
  return ret;
};

export default class InputSpin extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.number,
    minValue: PropTypes.number.isRequired,
    maxValue: PropTypes.number.isRequired,
    step: PropTypes.number,
    defaultValMin: PropTypes.bool,
    labelTop: PropTypes.bool,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    inline: PropTypes.bool,
    size: PropTypes.string,
    labelSize: PropTypes.number,
    inputSize: PropTypes.number,
    options: PropTypes.element,
    error: PropTypes.element,
    warning: PropTypes.element,
    onIncrement: PropTypes.func.isRequired,
    onDecrement: PropTypes.func.isRequired,
    clearIcon: PropTypes.element.isRequired,
    downIcon: PropTypes.element.isRequired,
    upIcon: PropTypes.element.isRequired,
  };

  static defaultProps = {
    labelTop: true,
    label: '',
    inline: false,
    size: null,
    labelSize: 6,
    inputSize: 30,
    onChange: () => {},
    disabled: false,
    required: false,
    options: [],
    error: false,
    warning: false,
    addEmpty: false,
    step: 1,
    value: 0,
    defaultValMin: false,
  };

  constructor(props) {
    super(props);
    this.onClear = this.onClear.bind(this);
    this.onIncremente = this.onIncremente.bind(this);
    this.onDecremente = this.onDecremente.bind(this);
  }

  onClear() {
    const event = {
      target: {
        name: this.props.name,
        value: null,
      },
    };
    this.props.onChange(event);
  }

  onIncremente() {
    const val = getValue(
      this.props.minValue,
      this.props.maxValue,
      this.props.value + this.props.step,
      this.props.defaultValMin,
    );
    const event = {
      target: {
        name: this.props.name,
        value: val,
      },
    };
    this.props.onChange(event);
  }

  onDecremente() {
    const val = getValue(
      this.props.minValue,
      this.props.maxValue,
      this.props.value - this.props.step,
      this.props.defaultValMin,
    );
    const event = {
      target: {
        name: this.props.name,
        value: val,
      },
    };
    this.props.onChange(event);
  }

  render() {
    const value = getValue(this.props.minValue, this.props.maxValue, this.props.value, this.props.defaultValMin);
    return (
      <div
        className={classnames(
          'form-group layout-input-spin',
          !this.props.labelTop && 'row',
          this.props.size && `form-group-${this.props.size}`
        )}
      >
        {!this.props.inline && this.props.label !== '' && (
          <label
            className={classnames(
              !this.props.labelTop && `col-sm-${this.onDecrementprops.labelSize} col-form-label`,
              this.props.size && `col-form-label-${this.props.size}`
            )}
          >
            {this.props.label}
            {this.props.required && <span>&nbsp;*</span>}
          </label>
        )}
        <div className={classnames(!this.props.labelTop && `col-sm-${this.props.inputSize}`)}>
          <div className="row">
            <div
              className={classnames(
                'col-36 input-group',
                this.props.size && `input-group-${this.props.size}`,
                this.props.error && 'is-invalid'
              )}
            >
              <input
                type="text"
                name={this.props.name}
                value={value || ''}
                className={classnames(
                  'border-secondary form-control',
                  this.props.size && `form-control-${this.props.size}`
                )}
                onChange={this.props.onChange}
              />
              <input type="hidden" name="autocomplete-field-@" value={this.props.value || ''} />
              <div className="input-group-append">
                <button
                  type="button"
                  className={classnames(
                    'btn btn-input',
                    'btn-outline-secondary',
                    'bg-light text-secondary pl-0 pr-0',
                    this.props.size === 'sm' && `btn-${this.props.size}`,
                  )}
                  onClick={() => this.onIncremente()}
                >
                  {this.props.upIcon}
                </button>
                <button
                  type="button"
                  className={classnames(
                    'btn btn-input',
                    'btn-outline-secondary',
                    'bg-light text-secondary pl-0 pr-0',
                    this.props.size === 'sm' && `btn-${this.props.size}`,
                  )}
                  onClick={() => this.onDecremente()}
                >
                  {this.props.downIcon}
                </button>
                <button
                  type="button"
                  className={classnames(
                    'btn btn-input',
                    'btn-outline-secondary',
                    'bg-light text-warning',
                    this.props.size === 'sm' && `btn-${this.props.size}`,
                  )}
                  onClick={this.onClear}
                >
                  {this.props.clearIcon}
                </button>
              </div>
            </div>
            {this.props.error && <div className="invalid-feedback">{this.props.error}</div>}
          </div>
        </div>
      </div>
    );
  }
}
