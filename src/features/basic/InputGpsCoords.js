import React, { Component } from 'react';
import { IMaskInput } from 'react-imask';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getFieldId } from '../helper';

const emptyCoords = { lat: '', lon: '' };

export default class InputGpsCoords extends Component {
  static propTypes = {
    borderColor: PropTypes.string,
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
    zoomIcon: PropTypes.element,
    zoomInactiveIcon: PropTypes.element,
    onZoomMap: PropTypes.func,
  };

  static defaultProps = {
    borderColor: 'secondary',
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
    zoomIcon: null,
    zoomInactiveIcon: null,
    onZoomMap: () => {},
  };


  static getDerivedStateFromProps(props, state) {
    const coords = JSON.parse(props.value) || {...emptyCoords};
    if (coords !== state.coords) {
      return {
        coords: coords,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    let coords = null;
    try {
      coords = JSON.parse(props.value) || {...emptyCoords};
    } catch (ex) {
      coords = {...emptyCoords};
    } 
    this.state = {
      coords: coords,
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    let { coords } = this.state;
    const coord = event.target.value;
    const latlon = event.target.name;
    coords[latlon] = coord;
    this.props.onChange({
      target: {
        name: this.props.name,
        value: JSON.stringify(coords),
      },
    });
  }

  render() {
    const { coords }  = this.state;
    let myId = getFieldId(this.props.name, this.props.id);
    let valid = false;
    if (coords && coords.lat !== '' && coords.lon !== '') {
      valid = true;
    } 
    return (
      <div className={classnames('input-gps-coords form-group', !this.props.labelTop && 'row', this.props.size && `form-group-${this.props.size}`)}>
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
            <div className="input-group-prepend">
              <span className={classnames(`input-group-text border-${this.props.borderColor} input-lat`)}>Lat</span>
            </div>
            <input
              type="text"
              className={classnames(
                `border-${this.props.borderColor} form-control`,
                this.props.size && `form-control-${this.props.size}`          
              )}
              id={myId}
              name="lat"
              value={coords ? coords.lat : ''}
              required={this.props.required}
              disabled={this.props.disabled}
              placeholder={this.props.placeholder}
              onChange={this.onChange}
            />
            <div className="input-group-prepend">
              <span className={classnames(`input-group-text border-${this.props.borderColor} input-lon`)}>Lon</span>
            </div>
            <input
              type="text"
              className={classnames(
                'border-secondary form-control',
                this.props.size && `form-control-${this.props.size}`,                
              )}
              id={myId}
              name="lon"
              value={coords ? coords.lon : ''}
              required={this.props.required}
              disabled={this.props.disabled}
              placeholder={this.props.placeholder}
              onChange={this.onChange}
            />
            {(this.props.onZoomMap && this.props.zoomIcon && this.props.zoomIcon !== '') &&
              <div className="input-group-append">
                <button
                  type="button"
                  className={classnames(
                  `btn btn-input btn-outline-${this.props.borderColor} bg-light`,
                  this.props.size && `btn-${this.props.size}`
                  )}
                  onClick={this.props.onZoomMap}
                  disabled={!valid} 
                >
                  {valid ? (
                    this.props.zoomIcon
                  ): (
                    this.props.zoomInactiveIcon
                  )}
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
