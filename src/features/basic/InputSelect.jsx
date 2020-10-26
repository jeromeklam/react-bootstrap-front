import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import log from 'loglevel';

export default class InputSelect extends Component {
  static propTypes = {
    id: PropTypes.string,
    addEmpty: PropTypes.bool,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.string,
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
    defaultValue: PropTypes.string,
    defaultLabel: PropTypes.string,
    datas: PropTypes.object,
  };

  static defaultProps = {
    labelTop: true,
    value: '',
    label: '',
    id: '',
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
    defaultValue: '',
    defaultLabel: 'Aucune sélection',
    datas: [],
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
    let myLogger = log.getLogger('react-bootstrap-front.inputSelect');
    myLogger.info('react-bootstrap-front.inputSelect.' + props.name + '.constructor');
    const { options } = { ...props };
    let value = props.value || '';
    let id = props.name;
    if (props.id && props.id !== null) {
      id = props.id;
    }
    this.state = {
      options: options,
      name: props.name,
      value: value,
      id: id,
      logger: myLogger,
    };
  }

  componentDidMount() {
    this.state.logger.debug('react-bootstrap-front.inputSelect.' +  this.state.name + '.componentDidMount');
    if (!this.props.addEmpty || (this.props.addEmpty && this.state.value !== this.props.defaultValue)) {
      this.state.logger.info('react-bootstrap-front.inputSelect.' + this.state.name + '.componentDidMount.check');
      let def = this.props.defaultValue;
      let found = false;
      this.state.options.forEach((oneOption) => {
        if (!def) {
          def = oneOption.value;
        }
        if (oneOption.value === this.state.value) {
          found = true;
        }
      });
      if (!found) {
        let datasProps = {};
        if (this.props.datas) {
          for (const [name, value] of Object.entries(this.props.datas)) {
            datasProps[`data-${name}`] = value;
          };
        }
        const send = {name: this.state.name, value: def, ...datasProps, dataset: this.props.datas};
        const event = {
          target: send,
        };
        this.state.logger.info('react-bootstrap-front.inputSelect.' + this.state.name + '.componentDidMount.onChange');
        this.state.logger.debug(event);
        this.props.onChange(event);
      }
    }
  }

  render() {
    const { options, value } = this.state;
    this.state.logger.info('react-bootstrap-front.inputSelect.' + this.state.name + '.render.' + (value || '~'));
    let datasProps = {};
    if (this.props.datas) {
      for (const [name, value] of Object.entries(this.props.datas)) {
        datasProps[`data-${name}`] = value;
      };
    }
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
        <div className={classnames(!this.props.labelTop && `col-xs-w${(!this.props.labelTop || this.props.inline) ? this.props.inputSize : '36'}`)}>
          <select
            type="text"
            className={classnames(
              'border-secondary form-control',
              (this.props.error || this.props.warning) && 'is-invalid',
              this.props.size && `form-control-${this.props.size}`
            )}
            name={this.props.name}
            id={this.props.name}
            disabled={this.props.disabled}
            required={this.props.required}
            value={value}
            onChange={this.props.onChange}
            {...datasProps}
          >
            {this.props.addEmpty && (
              <option key="000" value={this.props.defaultValue}>
                {this.props.defaultLabel}
              </option>
            )}
            {options.map(oneOption => (
              <option key={oneOption.value} value={oneOption.value}>
                {oneOption.label}
              </option>
            ))}
          </select>
          {this.props.error && <div className="invalid-feedback">{this.props.error}</div>}
          {this.props.warning && <div className="invalid-feedback">{this.props.warning}</div>}
        </div>
      </div>
    );
  }
}
