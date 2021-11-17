import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { EditorState, Modifier } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { convertToHTML, convertFromHTML } from 'draft-convert';
import { htmlToString } from '../helpers';
import { ColorPicker, Inline, FontSize } from './';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const myStyle = {
  height: 'auto',
};

const appenStyle = {
  maxHeight: '40px',
};

const toHtml = {
  styleToHTML: style => {
    const parts = style.split('-');
    switch (parts[0]) {
      case 'BOLD':
        return <strong />;
      case 'ITALIC':
        return <i />;
      case 'STRIKETHROUGH':
        return <s />;
      case 'UNDERLINE':
        return <u />;
      case 'SUPERSCRIPT':
        return <sup />;
      case 'SUBSCRIPT':
        return <sub />;
      case 'CODE':
        return <cite />;
      case 'color':
        return <span style={{ color: parts[1] }} />;
      case 'fontsize':
        return <span style={{ fontSize: parts[1] }} />;
      default:
        // nothing
        break;
    }
  },
  blockToHTML: block => {
    if (block.type === 'PARAGRAPH') {
      return <p />;
    }
  },
  entityToHTML: (entity, originalText) => {
    if (entity.type === 'LINK') {
      return <a href={entity.data.url}>{originalText}</a>;
    }
    return originalText;
  },
};

const fromHtml = {
  htmlToStyle: (nodeName, node, currentStyle) => {
    currentStyle = currentStyle
      .withMutations(style => {
        switch (nodeName) {
          case 'strong':
            style.add('BOLD');
            break;
          case 'i':
            style.add('ITALIC');
            break;
          case 's':
            style.add('STRIKETHROUGH');
            break;
          case 'u':
            style.add('UNDERLINE');
            break;
          case 'sup':
            style.add('SUPERSCRIPT');
            break;
          case 'sub':
            style.add('SUBSCRIPT');
            break;
          case 'cite':
            style.add('CODE');
            break;
          default:
            // nothing
            break;
        }
        if (node instanceof HTMLElement) {
          const color = node.style.color;
          if (color && color !== '') {
            const newColor = `color-${color.replace(/ /g, '')}`;
            style.add(newColor);
          }
          const fontSize = node.style.fontSize;
          if (fontSize && fontSize !== '') {
            style.add(`fontsize-${fontSize.replace(/px$/g, '')}`);
          }
        }
      })
      .toOrderedSet();
    return currentStyle;
  },
  htmlToEntity: (nodeName, node, createEntity) => {
    if (nodeName === 'a') {
      return createEntity('LINK', 'MUTABLE', { url: node.href });
    }
  },
  textToEntity: (text, createEntity) => {
    const result = [];
    text.replace(/\@(\w+)/g, (match, name, offset) => {
      const entityKey = createEntity('AT-MENTION', 'IMMUTABLE', { name });
      result.push({
        entity: entityKey,
        offset,
        length: match.length,
        result: match,
      });
    });
    return result;
  },
  htmlToBlock: (nodeName, node) => {
    if (nodeName === 'blockquote') {
      return {
        type: 'blockquote',
        data: {},
      };
    }
  },
};

export default class InputTextarea extends Component {
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
    const value = convertFromHTML(fromHtml)(content);
    this.state = {
      editorState: EditorState.createWithContent(value),
      toolbar: false,
    };
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onToolbar = this.onToolbar.bind(this);
    this.onClear = this.onClear.bind(this);
    this.onPresetText = this.onPresetText.bind(this);
    this.onAddPresetText = this.onAddPresetText.bind(this);
    this.onPresetTextClose = this.onPresetTextClose.bind(this);
  }

  onEditorStateChange(editorState) {
    this.setState({
      editorState,
    });
  }

  onChange(ev, editorState) {
    const content = editorState.getCurrentContent();
    const event = {
      target: {
        name: this.props.name,
        value: convertToHTML(toHtml)(content),
      },
    };
    this.props.onChange(event);
  }

  onToolbar() {
    this.setState({ toolbar: !this.state.toolbar });
  }

  onClear() {
    const content = convertFromHTML('<p />');
    this.setState({ editorState: EditorState.createWithContent(content) });
    const event = {
      target: {
        name: this.props.name,
        value: convertToHTML(content),
      },
    };
    this.props.onChange(event);
  }

  onPresetText() {
    this.props.onPresetText();
    this.setState({ presetText: true });
  }

  onAddPresetText(contentMore) {
    const editorState = this.state.editorState;
    let content = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    content = Modifier.insertText(content, selection, htmlToString(contentMore));
    let newState = EditorState.push(editorState, content);
    this.setState({ editorState: newState });
    const newContent = newState.getCurrentContent();
    const event = {
      target: {
        name: this.props.name,
        value: convertToHTML(toHtml)(newContent),
      },
    };
    this.props.onChange(event);
  }

  onPresetTextClose() {
    this.setState({ presetText: false });
  }

  render() {
    //<div className={classnames('input-group', (props.error || props.warning) && 'is-invalid')}>
    const { editorState, toolbar } = this.state;
    const editorToolbar = {
      options: ['inline','fontSize','colorPicker'],
      inline: {
        inDropdown: false,
        component: Inline,
        options: ['bold', 'italic', 'underline', 'superscript', 'subscript'],
      },
      fontSize: {
        component: FontSize,
        options: [7, 8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
      },
      colorPicker: {
        component: ColorPicker
      }
    };
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
            <Editor
              toolbarHidden={!toolbar}
              toolbar={editorToolbar}
              editorState={editorState}
              wrapperClassName="form-control border-rbf h-auto"
              onEditorStateChange={this.onEditorStateChange}
              onBlur={this.onChange}
            />
            <div className="input-group-append" style={appenStyle}>
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
              <button
                type="button"
                className={classnames(
                  'btn btn-input btn-outline-rbf bg-light',
                  this.props.size === 'sm' && `btn-${this.props.size}`
                )}
                onClick={this.onClear}
              >
                {this.props.clearIcon}
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
