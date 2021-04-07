import React, { Component } from 'react';
import { IMaskInput } from 'react-imask';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { InputGroup, InputGroupAppend } from './';

export const unities = [
  { value: 'J', label: 'J' },
  { value: 'H', label: 'H' },
  { value: 'M', label: 'min' },
];

export default class InputWorkload extends Component {
  static propTypes = {
    append: PropTypes.element,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    id: PropTypes.string,
    maxLength: PropTypes.number,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    pattern: PropTypes.string,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    size: PropTypes.string,
    value: PropTypes.string,
    oneDay: PropTypes.number,
    mask: PropTypes.string,
  };
  static defaultProps = {
    append: null,
    className: '',
    disabled: false,
    id: '',
    maxLength: 9999,
    onChange: () => {},
    pattern: null,
    placeholder: '',
    required: false,
    size: null,
    value: '',
    oneDay: 480,
    mask: '000'
  };

  constructor(props) {
    super(props);
    
    let value = props.value || 0;
    let unity = 'M';
    let display = '';
    if (value > 0) {
      if (value >= this.props.oneDay) {
        unity = 'J';
        display = value / this.props.oneDay;
      } else {
        if (value >= 60) {
          unity = 'H';
          display = value / 60;
        } else {
          display = value;
        }
      }
    }
    this.state = {
      unity: unity,
      value: value,
      display: '' + display,
    };
    this.onChange = this.onChange.bind(this);
    this.onChangeValue = this.onChangeValue.bind(this);
    this.onChangeUnity = this.onChangeUnity.bind(this);
  }

  onChange(display, unity) {
    let value = parseInt(display);
    if (value > 0) {
      if (unity === 'J') {
        value = value * this.props.oneDay;
      } else {
        if (unity === 'H') {
          value = value * 60;
        }
      }
    }
    this.setState({ display: display, value: value, unity: unity });
    this.props.onChange({
      target: {
        name: this.props.name,
        value: value,
      },
    });
  }

  onChangeValue(event) {
    this.onChange(event.target.value, this.state.unity);
  }

  onChangeUnity(event) {
    this.onChange(this.state.display, event.target.value);
  }

  render() {
    return (
      <div className="basic-input-workload">
        <InputGroup {...this.props}>
          <IMaskInput
            type="text"
            className={classnames(
              'border-secondary form-control',
              this.props.size && `form-control-${this.props.size}`,
              this.props.className && this.props.className,
            )}
            name={this.props.name}
            value={this.state.display}
            required={this.props.required}
            disabled={this.props.disabled}
            onChange={this.onChangeValue}
            pattern={this.props.pattern}
            placeholder={this.props.placeholder}
            maxLength={this.props.maxLength || ''}
            autoComplete={false}
            mask={this.props.mask}
          />
          <InputGroupAppend>
            <select
              type="text"
              name={`${this.props.name}-unity`}
              value={this.state.unity}
              className="border-secondary input-group-text bg-light"
              onChange={this.onChangeUnity}
            >
              {unities.map(oneUnity => (
                <option key={`key-${oneUnity.value}`} value={oneUnity.value}>
                  {oneUnity.label}
                </option>
              ))}
            </select>
          </InputGroupAppend>
        </InputGroup>
      </div>
    );
  }
}
