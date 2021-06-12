import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import log from 'loglevel';
import { InputGroup, InputGroupAppend, InputGroupPrepend, InputGroupText } from './';
import { getFieldId } from '../helper';

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
    options: PropTypes.array,
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
    if (props.value || props.options) {
      if (props.value !== state.value || props.options !== state.options) {
        return {
          value: props.value ? props.value : state.value,
          options: props.options ? props.options :  state.options,
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
    let id = getFieldId(props.name, props.id);
    this.state = {
      options: options,
      name: props.name,
      value: value,
      id: id,
      logger: myLogger,
    };
  }

  componentDidMount() {
    this.state.logger.debug('react-bootstrap-front.inputSelect.' + this.state.name + '.componentDidMount');
    if (!this.props.addEmpty || (this.props.addEmpty && this.state.value !== this.props.defaultValue)) {
      this.state.logger.info('react-bootstrap-front.inputSelect.' + this.state.name + '.componentDidMount.check');
      let def = this.props.defaultValue;
      let found = false;
      this.state.options.forEach(oneOption => {
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
          }
        }
        const send = { name: this.state.name, value: def, ...datasProps, dataset: this.props.datas };
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
    const myId = getFieldId(this.props.name, this.props.id);
    const { options, value } = this.state;
    this.state.logger.info('react-bootstrap-front.inputSelect.' + this.state.name + '.render.' + (value || '~'));
    let datasProps = {};
    if (this.props.datas) {
      for (const [name, value] of Object.entries(this.props.datas)) {
        datasProps[`data-${name}`] = value;
      }
    }
    return (
      <InputGroup {...this.props} id={myId}>
        {this.props.prepend && this.props.prepend !== '' && (
          <InputGroupPrepend>
            <InputGroupText className="border-secondary bg-light">{this.props.prepend}</InputGroupText>
          </InputGroupPrepend>
        )}
        <select
          type="text"
          className={classnames(
            'border-secondary form-control',
            (this.props.error || this.props.warning) && 'is-invalid',
            this.props.size && `form-control-${this.props.size}`
          )}
          name={this.props.name}
          id={myId}
          inputId={myId}
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
            <option key={`key-${oneOption.value}`} value={oneOption.value}>
              {oneOption.label}
            </option>
          ))}
        </select>
        {this.props.append && this.props.append !== '' && (
          <InputGroupAppend>
            <InputGroupText className="border-secondary bg-light">{this.props.append}</InputGroupText>
          </InputGroupAppend>
        )}
      </InputGroup>
    );
  }
}
