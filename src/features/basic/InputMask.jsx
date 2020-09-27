import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { IMaskInput } from 'react-imask';
import { getRandomInt } from '../helper';
import log from 'loglevel';

export default class InputMask extends Component {
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
    className: PropTypes.string,
    maxLength: PropTypes.number,
    mask: PropTypes.string.isRequired,
    help: PropTypes.string,
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
    className: '',
    maxLength: 9999,
    help: '',
  };

  static getDerivedStateFromProps(props, state) {
    if (props.value !== state.origin && props.value !== null && props.value !== '') {
      let myLogger = log.getLogger('freeassofront.inputMask');
      myLogger.info('freeassofront.inputMask.' + props.name + '.getDerivedStateFromProps');
      return { value: props.value, origin: props.value };
    }
    return null;
  }

  constructor(props) {
    super(props);
    let myLogger = log.getLogger('freeassofront.inputMask');
    myLogger.info('freeassofront.inputMask.' + props.name + '.constructor');
    let myId = props.id;
    if (myId === '') {
      myId = props.name;
      const rnd = getRandomInt(10000, 99999);
      myId = `${myId}-${rnd}`;
    }
    this.state = {
      myId: myId,
      value: props.value,
      origin: props.value,
      logger: myLogger,
    };
  }

  render() {
    this.state.logger.debug('freeassofront.inputMask.' +  this.props.name + '.render');
    this.state.logger.debug(this.state);
    return (
      <div className={classnames('form-group', !this.props.labelTop && 'row', this.props.size && `form-group-${this.props.size}`)}>
        {this.props.label !== '' && (
          <label
            htmlFor={this.state.myId}
            className={classnames(
              !this.props.labelTop && `col-sm-${this.props.labelSize} col-form-label`,
              this.props.size && `col-form-label-${this.props.size}`
            )}
          >
            {this.props.label}
            {this.props.required && <span>&nbsp;*</span>}
          </label>
        )}
        <div className={classnames(!this.props.labelTop && `col-sm-${this.props.inputSize}`)}>
          <IMaskInput
            mask={this.props.mask}
            type="text"
            className={classnames(
              'border-secondary form-control',
              this.props.size && `form-control-${this.props.size}`,
              (this.props.error || this.props.warning) && 'is-invalid',
              this.props.className && this.props.className,
            )}
            id={this.state.myId}
            name={this.props.name}
            value={this.state.value || ''}
            required={this.props.required}
            disabled={this.props.disabled}
            onAccept={(val) => {
              this.state.logger.debug('freeassofront.inputMask.' +  this.props.name + '.onAccept');
              this.state.logger.debug(val);
              this.setState({value: val});
              const event = {
                target: {
                  name: this.props.name,
                  value: null,
                },
              };
              this.props.onChange(event);
            }}
            onComplete={(val) => {
              this.state.logger.debug('freeassofront.inputMask.' +  this.props.name + '.onComplete');
              this.state.logger.debug(val);
              const event = {
                target: {
                  name: this.props.name,
                  value: val,
                },
              };
              this.props.onChange(event);
            }}
            autoComplete={this.props.autoComplete}
            placeholder={this.props.placeholder}
            lazy={false}
            autofix
            overwrite
            maxLength={this.props.maxLength || ''}
          />
          {this.props.help && this.props.help !== '' && (
            <small className="form-text text-muted">
              {this.props.help}
            </small>
          )}
          {this.props.warning && <div className="invalid-feedback">{this.props.warning}</div>}
          {this.props.error && <div className="invalid-feedback">{this.props.error}</div>}
        </div>
      </div>
    );
  }
};
