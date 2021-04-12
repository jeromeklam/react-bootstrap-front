import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { convertToHTML, convertFromHTML } from 'draft-convert';

const myStyle = {
  height: 'auto',
};

const appenStyle = {
  maxHeight: '40px',
};
const toHtml = {
  styleToHTML: (style) => {
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
        return <span style={{color: parts[1]}} />;
      case 'fontsize':
        return <span style={{fontSize: parts[1]}} />;
      default:
        // nothing
        break;
    }
  },
  blockToHTML: (block) => {
    if (block.type === 'PARAGRAPH') {
      return <p />;
    }
  },
  entityToHTML: (entity, originalText) => {
    if (entity.type === 'LINK') {
      return <a href={entity.data.url}>{originalText}</a>;
    }
    return originalText;
  }
};

const fromHtml = {
  htmlToStyle: (nodeName, node, currentStyle) => {
    currentStyle = currentStyle.withMutations((style) => {
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
    }).toOrderedSet();
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
  };

  constructor(props) {
    super(props);
    let content = '';
    if (this.props.value) {
      content = this.props.value;
    } else {
      content = '<p/>';
    }
    console.log('textarea', content);
    const value = convertFromHTML(fromHtml)(content);
    this.state = {
      editorState: EditorState.createWithContent(value),
      toolbar: false,
    };
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.onToolbar = this.onToolbar.bind(this);
    this.onClear = this.onClear.bind(this);
  }

  onEditorStateChange(editorState) {
    this.setState({
      editorState,
    });
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

  render() {
    const { editorState, toolbar } = this.state;
    return (
      <div className={classnames('form-group', !this.props.labelTop && 'row')}>
        {this.props.label !== '' && (
          <label htmlFor={this.props.id} className={classnames(!this.props.labelTop && 'col-xs-w6 col-form-label')}>
            {this.props.label}
            {this.props.required && <span>&nbsp;*</span>}
          </label>
        )}
        <div className={classnames(!this.props.labelTop && 'col-xs-w30')}>
          <div className="input-group" style={myStyle}>
            <Editor
              toolbarHidden={!toolbar}
              editorState={editorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="form-control border-secondary h-auto"
              editorClassName="editorClassName overflow-hidden"
              onEditorStateChange={this.onEditorStateChange}
            />
            <div className="input-group-append" style={appenStyle}>
              <button
                type="button"
                className={classnames(
                  'btn btn-input btn-outline-secondary bg-light',
                  this.props.size === 'sm' && `btn-${this.props.size}`
                )}
                onClick={this.onToolbar}
              >
                {this.props.toolbarIcon}
              </button>
              <button
                type="button"
                className={classnames(
                  'btn btn-input btn-outline-secondary bg-light',
                  this.props.size === 'sm' && `btn-${this.props.size}`
                )}
                onClick={this.onClear}
              >
                {this.props.clearIcon}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
