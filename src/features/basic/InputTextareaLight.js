import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const myStyle = {
  height: 'auto',
};
const appenStyle = {
  maxHeight: '40px',
};

export default class InputTextareaLight extends Component {
  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.string,
    size: PropTypes.string,
    labelTop: PropTypes.bool,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    clearIcon: PropTypes.element,
    toolbarIcon: PropTypes.element,
    presetTextIcon: PropTypes.element,
    onPresetText: PropTypes.func,
  };

  static defaultProps = {
    labelTop: true,
    value: '',
    label: '',
    id: '',
    size: '',
    onChange: () => {},
    disabled: false,
    required: false,
    clearIcon: null,
    toolbarIcon: null,
    presetTextIcon: null,
    onPresetText: null,
  };


  constructor(props) {
    super(props);
    let content = '';
    if (this.props.value) {
      content = this.props.value;
    } else {
      content = '<p/>';
    }
    this.state = {
      toolbar: false,
      myRef: React.createRef(),
      presetText: false,
      value: content,
    };
    this.onToolbar = this.onToolbar.bind(this);
    this.onClear = this.onClear.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onToolbar() {
    this.setState({ toolbar: !this.state.toolbar });
  }

  onClear() {
    const content = '<p />';
    const event = {
      target: {
        name: this.props.name,
        value: content,
      },
    };
    this.props.onChange(event);
  }

  onChange(content) {
    const event = {
      target: {
        name: this.props.name,
        value: content,
      },
    };
    this.props.onChange(event);
  }

  render() {
    //<div className={classnames('input-group', (props.error || props.warning) && 'is-invalid')}>
    const { toolbar } = this.state;
    return (
      <div className={classnames('form-group', !this.props.labelTop && 'row')}>
        {this.props.label !== '' && (
          <label htmlFor={this.props.id} className={classnames(!this.props.labelTop && 'col-xxs-w6 col-form-label')}>
            {this.props.label}
            {this.props.required && <span>&nbsp;*</span>}
          </label>
        )}
        <div className={classnames(!this.props.labelTop && 'col-xxs-w30')}>
          <div
            className={classnames('input-group', (this.props.error || this.props.warning) && 'is-invalid')}
            style={myStyle}
          >
            <ReactQuill className="w-100 rbf-quill" theme="snow" value={this.props.value} onChange={this.onChange}/>
          </div>
          {this.props.help && this.props.help !== '' && (
            <small className="form-text text-muted">{this.props.help}</small>
          )}
          {this.props.error && <div className="invalid-feedback">{this.props.error}</div>}
          {this.props.warning && <div className="invalid-feedback">{this.props.warning}</div>}
        </div>
      </div>
    );
  }
}
