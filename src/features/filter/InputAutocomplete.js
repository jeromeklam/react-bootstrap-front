import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { InputGroup, InputGroupPrepend, InputGroupAppend, Dropdown } from '../basic';
import { getFieldId } from '../helper';

export default class InputAutocomplete extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    clearIcon: PropTypes.element.isRequired,
    value: PropTypes.string,
    display: PropTypes.string,
    list: PropTypes.element.isRequired,
    onSearch: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    size: PropTypes.string,
    error: PropTypes.element,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    prepend: PropTypes.element,
    type: PropTypes.string.isRequired,
  };

  static defaultProps = {
    value: '',
    display: '',
    pickerDisplay: '',
    size: null,
    error: false,
    disabled: false,
    required: false,
    prepend: null,
  };

  constructor(props) {
    super(props);
    let value = '';
    let display = '';
    if (this.props.item) {
      value = this.props.item.id || '';
      display = this.props.item.display || '';
    }
    this.state = {
      myRef: React.createRef(),
      id: `id-${props.name}`,
      item: props.item || null,
      list: [],
      value: value,
      display: display,
      source: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onClear = this.onClear.bind(this);
  }

  onChange(event) {
    const search = '' + event.target.value;
    this.setState({ display: search });
    if (search.length >= 2) {
      this.props
        .onSearch(search)
        .then(result => {
          this.setState({ list: result });
        })
        .catch(errors => {
          this.setState({ list: [] });
        });
    } else {
      this.setState({ list: [] });
    }
  }

  onSelect(item) {
    if (item) {
      this.props.onSelect({
        target: { name: this.props.name, value: item.id },
      });
      let display = '';
      if (typeof this.props.display === 'function') {
        display = this.props.display(item);
      } else {
        this.props.display.split(',').map(elem => (display += item[elem] + ' '));
        display = display.trim();
      }
      this.setState({ value: item.id, display: display, list: [] });
    } else {
      this.setState({ list: [] });
    }
  }

  onClear() {
    this.setState({ value: '', display: '', list: [] });
    this.props.onSelect({ target: { name: this.props.name, value: null } });
  }

  render() {
    let myId = getFieldId(this.props.name, this.props.id);
    let open = this.state.display !== '' && this.state.list.length > 0;
    return (
      <InputGroup {...this.props} id={myId}>
        {this.props.prepend && this.props.prepend !== '' && (
          <InputGroupPrepend className=" border border-primary rounded-left">{this.props.prepend}</InputGroupPrepend>
        )}
        <input
          type="text"
          className={classnames(
            'border-primary form-control',
            this.props.size && `form-control-${this.props.size}`,
            (this.props.error || this.props.warning) && 'is-invalid',
            this.props.className && this.props.className
          )}
          id={myId}
          ref={this.state.myRef}
          name={this.props.name}
          value={this.state.display || ''}
          required={this.props.required}
          disabled={this.props.disabled}
          onChange={this.onChange}
          onClick={() => {
            this.onSelect();
          }}
          onKeyUp={e => {
            if (e && e.key === 'Escape') {
              this.onSelect();
            }
          }}
          autoComplete="off"
        />
        {this.props.clearIcon && (
          <InputGroupAppend>
            <button
              type="button"
              className={classnames(
                'btn btn-input btn-outline-primary bg-light',
                this.props.size && `btn-${this.props.size}`
              )}
              disabled={this.props.disabled}
              onClick={this.onClear}
            >
              {this.props.clearIcon}
            </button>
          </InputGroupAppend>
        )}
        {open && (
          <Dropdown
            className="border rounded border-primary bg-white text-secondary"
            myRef={this.state.myRef}
            onClose={this.onSelect}
            maxHeight="250px"
          >
            {this.state.list.map(item => (
              <a
                key={item.item.id}
                className="dropdown-item"
                onClick={() => {
                  this.onSelect(item.item);
                }}
              >
                {typeof this.props.display === 'function' ? (
                  this.props.display(item.item)
                ) : (
                  <div>
                    {this.props.display.split(',').map(elem => (
                      <span className="mr-2 text-nowrap">{item.item[elem]}</span>
                    ))}
                  </div>
                )}
              </a>
            ))}
          </Dropdown>
        )}
      </InputGroup>
    );
  }
}
