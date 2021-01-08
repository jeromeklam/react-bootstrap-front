import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getFieldId } from '../helper';

export default class InputGpsCoords extends Component {
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
    placeholder: PropTypes.string,
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
    placeholder: '',
  };

  render() {
    let myId = getFieldId(this.props.name, this.props.id);
    return (
      <div className={classnames('form-group', !this.props.labelTop && 'row', this.props.size && `form-group-${this.props.size}`)}>
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
          <div className={classnames(
              'input-group', 
              (this.props.error || this.props.warning) && 'is-invalid'
            )}  
          >
            <input
              type="text"
              className={classnames(
                'border-secondary form-control',
                this.props.size && `form-control-${this.props.size}`          
              )}
              id={myId}
              name={this.props.name}
              value={this.props.value || ''}
              required={this.props.required}
              disabled={this.props.disabled}
              placeholder={this.props.placeholder}
              onChange={this.onChange}
            />
            <input
              type="text"
              className={classnames(
                'border-secondary form-control',
                this.props.size && `form-control-${this.props.size}`,                
              )}
              id={myId}
              name={this.props.name}
              value={this.props.value || ''}
              required={this.props.required}
              disabled={this.props.disabled}
              placeholder={this.props.placeholder}
              onChange={this.onChange}
            />
          </div>
          {this.props.error && <div className="invalid-feedback">{this.props.error}</div>}
          {this.props.warning && <div className="invalid-feedback">{this.props.warning}</div>}
        </div>
      </div>
    );

  }
}
