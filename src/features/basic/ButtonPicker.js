import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

export default class ButtonPicker extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    size: PropTypes.string,
    labelSize: PropTypes.number,
    buttonSize: PropTypes.number,
    labelTop: PropTypes.bool,
    required: PropTypes.bool,
    clearIcon: PropTypes.element,
    value: PropTypes.string,
    display: PropTypes.string,
    onZoom: PropTypes.func,
    onClear: PropTypes.func,
    disabled: PropTypes.bool,
  };
  static defaultProps = {
    clearIcon: null,
    size: null,
    labelSize: 6,
    buttonSize: 30,
    labelTop: true,
    required: false,
    value: '',
    diplay: '',
    onZoom: null,
    onClear: null,
    disabled: false,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div
        className={classnames(
          'basic-button-picker form-group',
          !this.props.labelTop && 'row',
          this.props.size && `form-group-${this.props.size}`
        )}
      >
        {this.props.label !== '' && (
          <label
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
          className={classnames('btn btn-picker', !this.props.labelTop && `col-xs-w${this.props.buttonSize}`)}
          onClick={this.props.onZoom}
        >
          {!this.props.disabled && (
            <div className="btn-group-vertical">
              <button
                type="button"
                disabled={this.props.disabled}
                className={classnames('btn btn-clear', this.props.size === 'sm' && `btn-${this.props.size}`)}
                onClick={ev => {
                  if (ev) {
                    ev.stopPropagation();
                  }
                  this.props.onClear();
                }}
              >
                {this.props.clearIcon}
              </button>
            </div>
          )}

          {typeof this.props.display === 'string' || this.props.display instanceof String ? (
            <span>
              {' '}
              <div dangerouslySetInnerHTML={{ __html: `${this.props.display}` }} />
            </span>
          ) : (
            <span>{this.props.display}</span>
          )}
        </div>
      </div>
    );
  }
}
