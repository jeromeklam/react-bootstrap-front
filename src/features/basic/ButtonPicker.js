import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

export class ButtonPicker extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    size: PropTypes.string,
    labelSize: PropTypes.number,
    buttonSize: PropTypes.number,
    disabled: PropTypes.bool,
    labelTop: PropTypes.bool,
    required: PropTypes.bool,
    clearIcon: PropTypes.element,
    value: PropTypes.string,
    display: PropTypes.string,
    onZoom: PropTypes.func,
    onClear: PropTypes.func,
  };
  static defaultProps = {
    clearIcon: null,
    size: null,
    disabled: false,
    labelSize: 6,
    buttonSize: 30,
    labelTop: true,
    required: false,
    value: '',
    diplay: '',
    onZoom: null,
    onClear: null,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div
        className={classnames(
          'ui-button-picker form-group',
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
        <div className="ui-button-picker-wrapper">
          <button
            className={classnames(
              'btn btn-picker bg-light w-100',
              !this.props.labelTop && `col-xs-w${this.props.buttonSize}`
            )}
            onClick={this.props.onZoom}
          >
            <span>
              {' '}
              <div dangerouslySetInnerHTML={{ __html: `${this.props.display}` }} />
            </span>
          </button>
          {!this.props.disabled && (
            <div className="btn-group-vertical">
              <button
                type="button"
                disabled={this.props.disabled}
                className={classnames(
                  'btn btn-clear btn-xs bg-light',
                  this.props.size === 'sm' && `btn-${this.props.size}`
                )}
                onClick={ev => {
                  if (ev) {
                    ev.preventDefault();
                    ev.stopPropagation();
                  }
                  this.props.onClear();
                }}
              >
                {this.props.clearIcon}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

/**
 *
 */
export default ButtonPicker;