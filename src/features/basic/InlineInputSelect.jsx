import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default class InlineInputSelect extends Component {
  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    size: PropTypes.string,
    options: PropTypes.element,
    error: PropTypes.element,
    addEmpty: PropTypes.bool,
  };

  static defaultProps = {
    value: '',
    id: '',
    size: null,
    onChange: () => {},
    disabled: false,
    required: false,
    options: [],
    error: null,
    addEmpty: false,
  };

  static getDerivedStateFromProps(props, state) {
    if (props.value) {
      if (props.value !== state.value || props.options !== state.options) {
        return {
          value: props.value,
          options: props.options,
        };
      }
    }
    return null;
  }

  constructor(props) {
    super(props);
    const { options, addEmpty } = { ...props };
    let value = '';
    if (props.value && props.value !== null) {
      value = props.value;
    }
    let id = props.name;
    if (props.id && props.id !== null) {
      id = props.id;
    }
    this.state = {
      options: options,
      empty: addEmpty,
      name: props.name,
      value: value,
      id: id,
    };
  }

  componentDidMount() {
    let def = '';
    let found = false;
    this.state.options.forEach((oneOption) => {
      def = oneOption.value;
      if (oneOption.value === this.state.value) {
        found = true;
      }
    });
    if (!found) {
      const event = {
        target: {
          name: this.state.name,
          value: def,
        },
      };
      this.props.onChange(event);
    }
  }

  render() {
    const { options, value, addEmpty } = this.state;
    return (
      <div>
        <select
          className={classnames(
            'form-control border-secondary',
            this.props.size && `form-control-${this.props.size}`,
            this.props.error && 'is-invalid',
          )}
          name={this.props.name}
          id={this.props.name}
          disabled={this.props.disabled}
          required={this.props.required}
          value={value}
          onChange={this.props.onChange}
        >
          {addEmpty && (
            <option key="000" value="">
              Aucune sélection
            </option>
          )}
          {options.map(oneOption => (
            <option key={oneOption.value} value={oneOption.value}>
              {oneOption.label}
            </option>
          ))}
        </select>
        {this.props.error && <div className="invalid-feedback">{this.props.error}</div>}
      </div>
    );
  }
}
