import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { HtmlEditor, Toolbar, Editor } from '@aeaton/react-prosemirror'
import { plugins, schema, toolbar } from '@aeaton/react-prosemirror-config-default'

const myStyle = {
  height: 'auto',
};
const appenStyle = {
  maxHeight: '40px',
};

export default class InputTextareaHtml extends Component {
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
    this.state = {
      toolbar: false,
      myRef: React.createRef(),
      presetText: false,
    };
    this.onToolbar = this.onToolbar.bind(this);
    this.onClear = this.onClear.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onToolbar() {
    this.setState({ toolbar: !this.state.toolbar });
  }

  onClear() {
    const event = {
      target: {
        name: this.props.name,
        value: null,
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
    let content = '';
    if (this.props.value) {
      content = this.props.value;
    } else {
      content = '<p/>';
    }
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
            <div className="form-control border-rbf h-auto">
              <HtmlEditor
                schema={schema}
                plugins={plugins}
                value={content}
                handleChange={this.onChange}
                debounce={250}
              >
                {this.state.toolbar && <Toolbar toolbar={toolbar} />}
                <Editor autoFocus />
              </HtmlEditor>
            </div>
            <div className="input-group-append" style={appenStyle}>
              {this.props.presetTextIcon && (
                <>
                  <button
                    type="button"
                    className={classnames(
                      'btn btn-input btn-outline-rbf bg-light',
                      this.props.size === 'sm' && `btn-${this.props.size}`
                    )}
                    onClick={this.onPresetText}
                    ref={this.state.myRef}
                  >
                    {this.props.presetTextIcon}
                  </button>
                  {this.props.presetTexts && this.props.presetTexts.length > 0 && this.state.presetText && (
                    <Dropdown
                      align="bottom-right"
                      myRef={this.state.myRef}
                      maxHeight="250px"
                      onClose={this.onPresetTextClose}
                    >
                      <DropdownMenu>
                        {Array.isArray(this.props.presetTexts) &&
                          this.props.presetTexts.map(text => {
                            return (
                              <DropdownMenuOption
                                key={`text-${text.id}`}
                                label={text.text_code}
                                onClick={() => {
                                  this.onAddPresetText(text.text_content);
                                }}
                              />
                            );
                          })}
                      </DropdownMenu>
                    </Dropdown>
                  )}
                </>
              )}
              <button
                type="button"
                className={classnames(
                  'btn btn-input btn-outline-rbf bg-light',
                  this.props.size === 'sm' && `btn-${this.props.size}`
                )}
                onClick={this.onToolbar}
              >
                {this.props.toolbarIcon}
              </button>
            </div>
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
