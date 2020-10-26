import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Dropdown } from './';

const listStyle = {
  maxHeight: '200px',
  overflowX: 'hidden',
  overflowY: 'auto',
  left: '10px',
};

export default class InputPicker extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    clearIcon: PropTypes.element.isRequired,
    moreIcon: PropTypes.element.isRequired,
    zoomIcon: PropTypes.element,
    addIcon: PropTypes.element,
    value: PropTypes.string,
    display: PropTypes.string,
    onClear: PropTypes.func.isRequired,
    onMore: PropTypes.func.isRequired,
    onZoom: PropTypes.func,
    onAdd: PropTypes.func,
    pickerUp: PropTypes.bool,
    list: PropTypes.element.isRequired,
    onChange: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    pickerId: PropTypes.string,
    pickerDisplay: PropTypes.string,
    size: PropTypes.string,
    labelSize: PropTypes.number,
    inputSize: PropTypes.number,
    required: PropTypes.bool,
    error: PropTypes.element,
    labelTop: PropTypes.bool,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    addIcon: null,
    zoomIcon: null,
    value: '',
    display: '',
    pickerId: '',
    pickerDisplay: '',
    pickerUp: false,
    size: null,
    labelSize: 6,
    inputSize: 30,
    required: false,
    error: false,
    labelTop: true,
    onAdd: null,
    onZoom: null,
    disabled: false,
  };

  static getDerivedStateFromProps(props, state) {
    if (props.list !== state.list || props.display !== state.display) {
      return { open: props.list && props.list.length > 0 && props.display !== '' };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      myRef: React.createRef(),
      id: `id-${props.name}`,
      open: props.list && props.list.length > 0 && props.display !== '',
    };
  }

  render() {
    console.log("FK ",this.props);
    return (
      <div
        className={classnames(
          'form-group layout-input-picker',
          !this.props.labelTop && 'row',
          this.props.size && `form-group-${this.props.size}`
        )}
      >
        {!this.props.inline && this.props.label !== '' && (
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
        <div className={classnames(!this.props.labelTop && `col-xs-w${this.props.inputSize}`)}>
          <div
            ref={this.state.myRef}
            className={classnames(
              'input-group',
              this.props.size && `input-group-${this.props.size}`,
              this.props.pickerUp && 'dropup',
              this.props.error && 'is-invalid'
            )}
          >
            <input
              type="text"
              id={this.state.id}
              name={this.props.name}
              value={this.props.display || ''}
              disabled={this.props.disabled}
              className={classnames(
                'border-secondary form-control',
                this.props.size && `form-control-${this.props.size}`
              )}
              onChange={this.props.onChange}
              onClick={() => {
                this.props.onSelect();
              }}
              onKeyUp={(e) => {
                if (e && e.key === 'Escape') {
                  this.props.onSelect();
                }
              }}
              autoComplete="off"
            />
            <input type="hidden" name="autocomplete-field-@" value={this.props.value || ''} />
            <div className="input-group-append">
              {this.props.onAdd && (
                <button
                  type="button"
                  className={classnames(
                    'btn btn-input btn-outline-secondary bg-light',
                    this.props.size === 'sm' && `btn-${this.props.size}`
                  )}
                  onClick={this.props.onAdd}
                >
                  {this.props.addIcon}
                </button>
              )}
              {this.props.onZoom && (this.props.value && this.props.value > 0) && (
                <button
                  type="button"
                  className={classnames(
                    'btn btn-input btn-outline-secondary bg-light',
                    this.props.size === 'sm' && `btn-${this.props.size}`
                  )}
                  onClick={this.props.onZoom}
                >
                  {this.props.zoomIcon}
                </button>
              )}
              {this.props.onMore && (
                <button
                  type="button"
                  disabled={this.props.disabled}
                  className={classnames(
                    'btn btn-input btn-outline-secondary bg-light',
                    this.props.size === 'sm' && `btn-${this.props.size}`
                  )}
                  onClick={this.props.onMore}
                >
                  {this.props.moreIcon}
                </button>
              )}
              {this.props.onClear &&
                ((this.props.value && this.props.value > 0) || (this.props.display && this.props.display !== '')) && (
                <button
                  type="button"
                  disabled={this.props.disabled}
                  className={classnames(
                    'btn btn-input btn-outline-secondary bg-light',
                    this.props.size === 'sm' && `btn-${this.props.size}`
                  )}
                  onClick={this.props.onClear}
                >
                  {this.props.clearIcon}
                </button>
              )}
            </div>
            {this.state.open && (
              <Dropdown
                className="border rounded border-secondary bg-white text-secondary"
                myRef={this.state.myRef}
                onClose={this.props.onSelect}
                maxHeight="250px"
              >
                {this.props.list.map(item => (
                  <a
                    key={item[this.props.pickerId]}
                    className="dropdown-item"
                    onClick={() => {
                      item.id = '' + item[this.props.pickerId];
                      this.props.onSelect(item);
                    }}
                  >
                    {typeof this.props.pickerDisplay === 'function' ? (
                      this.props.pickerDisplay(item)
                    ) : (
                      <div>
                        {this.props.pickerDisplay.split(',').map(elem => (
                          <span className="mr-2 text-nowrap">{item[elem]}</span>
                        ))}
                      </div>
                    )}
                  </a>
                ))}
              </Dropdown>
            )}
          </div>
          {this.props.error && <div className="invalid-feedback">{this.props.error}</div>}
        </div>
      </div>
    );
  }
}
