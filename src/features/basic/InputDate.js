import React, { forwardRef, Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { IMaskInput } from 'react-imask';
import IMask from 'imask';
import DatePicker, { registerLocale } from 'react-datepicker';
import fr from 'date-fns/locale/fr';
import { displayDate } from '../helper';
import { Dropdown } from './';

registerLocale('fr', fr);

export default class InputDate extends Component {
  static propTypes = {
    borderColor: PropTypes.string,
    calIcon: PropTypes.element.isRequired,
    delIcon: PropTypes.element.isRequired,
    disabled: PropTypes.bool,
    error: PropTypes.element,
    id: PropTypes.string,
    inputSize: PropTypes.number,
    label: PropTypes.string,
    labelSize: PropTypes.number,
    labelTop: PropTypes.bool,
    locked: PropTypes.bool,
    lockOffIcon: PropTypes.element,
    lockOnIcon: PropTypes.element,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    onLockOn: PropTypes.func,
    onLockOff: PropTypes.func,
    prepend: PropTypes.element,
    required: PropTypes.bool,
    size: PropTypes.string,
    value: PropTypes.string,
  };

  static defaultProps = {
    borderColor: 'secondary',
    disabled: false,
    error: false,
    id: '',
    inputSize: 30,
    label: '',
    labelSize: 6,
    labelTop: true,
    locked: false,
    lockOffIcon: null,
    lockOnIcon: null,
    onChange: () => {},
    onLockOn: null,
    onLockOff: null,
    prepend: null,
    required: false,
    size: null,
    value: '',
  };

  static getDerivedStateFromProps(props, state) {
    if (props.value) {
      const newDate = displayDate(Date.parse(props.value));
      if (newDate !== state.value) {
        const myDate = new Date(Date.parse(props.value));
        return { value: newDate, date: !isNaN(myDate.getTime()) ? myDate : null };
      }
    }
    if (props.value === null || props.value === '') {
      if (props.value !== state.value) {
        return { value: '', date: null };
      }
    }
    return null;
  }

  constructor(props) {
    super(props);
    let myDate = new Date(Date.parse(props.value));
    this.state = {
      myRef: React.createRef(),
      open: false,
      date: !isNaN(myDate.getTime()) ? myDate : null,
      value: displayDate(Date.parse(props.value)),
    };
    this.onDatePicker = this.onDatePicker.bind(this);
    this.onClear = this.onClear.bind(this);
    this.onComplete = this.onComplete.bind(this);
    this.onToggle = this.onToggle.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onClear() {
    const event2 = {
      target: {
        name: this.props.name,
        value: null,
      },
    };
    this.props.onChange(event2);
  }

  onToggle() {
    this.setState({ open: !this.state.open });
  }

  onChange(event) {
    const { value } = event.target;
    if (value === '__/__/____') {
      const event2 = {
        target: {
          name: this.props.name,
          value: null,
        },
      };
      this.props.onChange(event2);
    }
  }

  onComplete(val) {
    let dd = '';
    try {
      const [day, month, year] = val.split('/');
      dd = new Date(Number(year), Number(month) - 1, Number(day)).toISOString();
    } catch (ex) {
      dd = '';
    }
    const event2 = {
      target: {
        name: this.props.name,
        value: dd,
      },
    };
    this.props.onChange(event2);
  }

  onDatePicker(date) {
    const event = {
      target: {
        name: this.props.name,
        value: date,
      },
    };
    this.props.onChange(event);
    this.onToggle();
  }

  render() {
    return (
      <div
        className={classnames(
          'form-group',
          !this.props.labelTop && 'row',
          this.props.size && `form-group-${this.props.size}`
        )}
      >
        {this.props.label !== '' && (
          <label
            htmlFor={this.props.id}
            className={classnames(
              !this.props.labelTop && `col-xs-w${this.props.labelSize} col-form-label`,
              this.props.size && `col-form-label-${this.props.size}`
            )}
          >
            {this.props.label}
            {this.props.required && <span>&nbsp;*</span>}
          </label>
        )}
        <div
          className={classnames(
            !this.props.labelTop && `col-xs-w${this.props.inputSize}`,
            this.props.error && 'is-invalid'
          )}
        >
          <div className="input-group" ref={this.state.myRef}>
            {this.props.prepend && (
              <div className="input-group-prepend border border-primary rounded-left">{this.props.prepend}</div>
            )}
            <IMaskInput
              mask={Date}
              disabled={this.props.disabled || this.props.locked}
              pattern={'d1d2{/}`m1m2{/}`Y'}
              blocks={{
                d1: {
                  mask: IMask.MaskedRange,
                  from: 0,
                  to: 3,
                },
                d2: {
                  mask: IMask.MaskedRange,
                  from: 0,
                  to: 9,
                },
                m1: {
                  mask: IMask.MaskedRange,
                  from: 0,
                  to: 1,
                },
                m2: {
                  mask: IMask.MaskedRange,
                  from: 0,
                  to: 9,
                },
                Y: {
                  mask: IMask.MaskedRange,
                  from: 1900,
                  to: 2099,
                },
              }}
              format={date => {
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return [day, month, year].join('/');
              }}
              parse={str => {
                const [day, month, year] = str.split('/');
                return new Date(Number(year), Number(month) - 1, Number(day));
              }}
              lazy={false}
              overwrite={true}
              value={this.state.value}
              onInput={this.onChange}
              onComplete={this.onComplete}
              className={classnames(
                `border-${this.props.borderColor} form-control`,
                this.props.size && `form-control-${this.props.size}`,
                (this.props.error || this.props.warning) && 'is-invalid'
              )}
            />
            <div className="input-group-append">
              {this.props.onLockOn !== null && this.props.onLockOff !== null && (
                <button
                  type="button"
                  disabled={this.props.disabled}
                  className={classnames(
                    `btn btn-input btn-outline-${this.props.borderColor} bg-light`,
                    this.props.size && `btn-${this.props.size}`
                  )}
                  onClick={
                    this.props.locked
                      ? () => this.props.onLockOff(this.props.name)
                      : () => this.props.onLockOn(this.props.name)
                  }
                >
                  {this.props.locked ? this.props.lockOnIcon : this.props.lockOffIcon}
                </button>
              )}
              <button
                type="button"
                disabled={this.props.disabled || this.props.locked}
                className={classnames(
                  `btn btn-input btn-outline-${this.props.borderColor} bg-light`,
                  this.props.size && `btn-${this.props.size}`
                )}
                onClick={this.onToggle}
              >
                {this.props.calIcon}
              </button>
              <button
                type="button"
                disabled={this.props.disabled || this.props.locked}
                className={classnames(
                  `btn btn-input btn-outline-${this.props.borderColor} bg-light`,
                  this.props.size && `btn-${this.props.size}`
                )}
                onClick={this.onClear}
              >
                {this.props.delIcon}
              </button>
            </div>
          </div>
        </div>
        {this.state.open && (
          <Dropdown myRef={this.state.myRef} onClose={this.onToggle}>
            <DatePicker
              selected={this.state.date}
              onChange={this.onDatePicker}
              onChangeRaw={this.onChangeRaw}
              dateFormat="dd/MM/yyyy"
              locale="fr"
              showWeekNumbers
              inline
            />
          </Dropdown>
        )}
        {this.props.error && <div className="invalid-feedback">{this.props.error}</div>}
      </div>
    );
  }
}
