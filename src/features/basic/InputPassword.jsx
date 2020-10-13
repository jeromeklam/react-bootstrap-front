import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getRandomInt } from '../helper';

export default class InputPassword extends Component {
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
    viewIcon: PropTypes.element,
  }

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
    pattern: '',
    viewIcon: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      hidden: true,
      security: '',
      tooltip: '',
    };
    this.onView = this.onView.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    let ascii = 0;
    let maj = 0;
    let min = 0;
    let num = 0;
    let spec = 0;
    let comm = '';
    let psw = event.target.value;
    if (psw.length > 0) {
      if (psw.length > 8) {
        for (let car of psw) {
          ascii = car.charCodeAt(0);          
          if (48 <= ascii && ascii <= 57) {
            num = num + 1;
          } else {
            if (65 <= ascii && ascii <= 90) {
              maj = maj + 1;
            } else {
              if (97 <= ascii && ascii <= 122) {
                min = min + 1;
              } else {
                spec = spec + 1;
              }              
            }
          }
        }
        if (num > 0 && maj > 0 && min > 0) {
          if (spec > 0) {
            this.setState({ security: 'primary', tooltip: 'Mot de passe très robuste !' });    
          } else {
            this.setState({ security: 'secondary', tooltip: 'Mot de passe sans caractère spécial : bonne robustesse' });    
          }
        } else {
          this.setState({ security: 'warning' });
          comm = 'Mot de passe ';
          if (num === 0) {
            comm = comm + 'sans chiffre, ';
          } 
          if (maj === 0) {
            comm = comm + 'sans majuscule, ';
          }
          if (min === 0) {
            comm = comm + 'sans minuscule, ';
          } 
          comm.trim();
          comm = comm.slice(0,-1) + ' : faible robustesse...'
          this.setState({ tooltip: comm });
        }
      } else {
        this.setState({ security: 'danger', tooltip: '8 caractères pour une robustesse minimum' });  
      }
    } else {
      this.setState({ security: '', tooltip: '' });  
    }
    this.props.onChange(event);
  }

  onView() {
    this.setState({ hidden: !this.state.hidden });
  }

  render() {
    let myId = this.props.id;
    if (myId === '') {
      myId = this.props.name;
      const rnd = getRandomInt(10000, 99999);
      myId = `${myId}-${rnd}`;
    }
    let type = "text";
    if (this.state.hidden) {
      type = "password";
    }
    return (
      <div className={classnames('form-group', !this.props.labelTop && 'row', this.props.size && `form-group-${this.props.size}`)}>
        {this.props.label !== '' && (
          <label
            htmlFor={myId}
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
          <div className='input-group'>
            <input
              type={type}
              className={classnames(
                'border-secondary form-control',
                this.props.size && `form-control-${this.props.size}`,
                (this.props.error || this.props.warning) && 'is-invalid',
                (this.props.securityIcon) && 'border-right-0'
              )}
              id={myId}
              name={this.props.name}
              value={this.props.value || ''}
              required={this.props.required}
              disabled={this.props.disabled}              
              autoComplete={this.props.autoComplete}
              placeholder={this.props.placeholder}
              onChange={this.onChange}
            />
            {this.props.securityIcon && this.state.security !== '' && 
              <div className="input-group-append" title={this.state.tooltip}>
                <span className={classnames(
                  'input-group-text',
                  'border-secondary border-left-0',
                  'bg-white', `text-${this.state.security}`)}
                >
                  {this.props.securityIcon}
                </span>                
              </div>
            }
            {this.props.viewIcon && this.props.viewIcon !== '' && 
              <div className="input-group-append">                
                <button
                  type="button"
                  className={classnames(
                    'btn btn-input',
                    'btn-outline-secondary',
                    'bg-white text-secondary',
                    this.props.size === 'sm' && `btn-${this.props.size}`,
                  )}
                  disabled={this.props.disabled}
                  onMouseDown={this.onView}
                  onMouseUp={this.onView}
                >
                  {this.props.viewIcon}
                </button>
              </div>
            }
          </div>
          {this.props.error && <div className="invalid-feedback">{this.props.error}</div>}
          {this.props.warning && <div className="invalid-feedback">{this.props.warning}</div>}
        </div>
      </div>
    );
  }
}

