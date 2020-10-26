import React, { forwardRef, Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { IMaskInput } from 'react-imask';
import IMask from 'imask';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import fr from 'date-fns/locale/fr';
import './InputDatetime.css';
import { displayDatetime } from '../helper';
import { Dropdown } from './';

registerLocale('fr', fr);

export default class InputDatetime extends Component {
  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.string,
    labelTop: PropTypes.bool,
    onChange: PropTypes.func,
    onLockToggle: PropTypes.func,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    size: PropTypes.string,
    labelSize: PropTypes.number,
    inputSize: PropTypes.number,
    delIcon: PropTypes.element.isRequired,
    calIcon: PropTypes.element.isRequired,
    lockIcon: PropTypes.element,
    error: PropTypes.element,
  };

  static defaultProps = {
    labelTop: true,
    value: '',
    label: '',
    id: '',
    onLockToggle: null,
    size: null,
    labelSize: 6,
    inputSize: 30,
    onChange: () => {},
    disabled: false,
    required: false,
    error: false,
    lockIcon: null,
  };

  static getDerivedStateFromProps(props, state) {
    if (props.value) {
      const newDate = displayDatetime(Date.parse(props.value));
      if (newDate !== state.value) {
        const myDate = new Date(Date.parse(props.value));
        return { value: newDate, date: !isNaN(myDate.getTime()) ? myDate : null };
      }
    } if (props.value === null || props.value === '') {
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
      value: displayDatetime(Date.parse(props.value)),
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
    if (value === '__/__/____ __:__') {
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
      const parts = val.split(' ');
      const [day, month, year] = parts[0].split('/');
      const [hour, minutes] = parts[1].split(':');
      dd = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minutes));
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
            this.props.error && 'is-invalid',
          )}
        >
          <div className="input-group" ref={this.state.myRef}>
            <IMaskInput
              mask={Date}
              disabled={this.props.disabled}
              pattern={'d1d2{/}`m1m2{/}`Y{ }`H{:}`m'}
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
                H: {
                  mask: IMask.MaskedRange,
                  from: 0,
                  to: 23,
                },
                m: {
                  mask: IMask.MaskedRange,
                  from: 0,
                  to: 59,
                },
              }}
              format={(date) => {
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                const hour = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                return [day, month, year].join('/') + ' ' + hour + ':' + minutes;
              }}
              parse={(str) => {
                const parts = str.split(' ');
                const [day, month, year] = parts[0].split('/');
                const [hour, minutes] = parts[1].split(':');
                return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minutes));
              }}
              lazy={false}
              overwrite={true}
              value={this.state.value}
              onInput={this.onChange}
              onComplete={this.onComplete}
              className={classnames(
                'border-secondary form-control',
                this.props.size && `form-control-${this.props.size}`,
                (this.props.error || this.props.warning) && 'is-invalid',
              )}
            />
            <div className="input-group-append">
              {this.props.lockIcon !== null &&
                <button
                  type="button"
                  className={classnames(
                    'btn btn-input btn-outline-secondary bg-light',
                    this.props.size && `btn-${this.props.size}`,
                  )}
                  onClick={this.props.onLockToggle}
                >
                  {this.props.lockIcon}
                </button>
              }
              <button
                type="button"
                disabled={this.props.disabled}
                className={classnames(
                  'btn btn-input btn-outline-secondary bg-light',
                  this.props.size && `btn-${this.props.size}`,
                )}
                onClick={this.onToggle}
              >
                {this.props.calIcon}
              </button>
              <button
                type="button"
                disabled={this.props.disabled}
                className={classnames(
                  'btn btn-input btn-outline-secondary bg-light',
                  this.props.size && `btn-${this.props.size}`,
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
            <div style={{ width: '360px' }}>
              <DatePicker
                selected={this.state.date}
                onChange={this.onDatePicker}
                onChangeRaw={this.onChangeRaw}
                dateFormat="dd/MM/yyyy HH:mm"
                locale="fr"
                showWeekNumbers
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Heures"
                inline
              />
            </div>
          </Dropdown>
        )}
        {this.props.error && <div className="invalid-feedback">{this.props.error}</div>}
      </div>
    );
  }
}
