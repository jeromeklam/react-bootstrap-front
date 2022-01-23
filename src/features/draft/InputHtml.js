import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { camelCase } from 'lodash';
import { EditorState, Modifier, CompositeDecorator } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { convertToHTML, convertFromHTML } from 'draft-convert';
import { htmlToString } from '../helpers';
import { ColorPicker, Inline, FontSize, FontFamily, Image, MailMerge as MailMergeOption } from './';
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
    let styles = {};
    if (block.data && Object.keys(block.data).length > 0) {
      Object.keys(block.data).forEach(key => {
        styles[camelCase(key)] = block.data[key];
      });
    }
    if (block.type === 'PARAGRAPH') {
      return <p style={styles} />;
    }
    if (block.type === 'atomic') {
      return {
        start: "",
        end: "",
      }
    }
    if (Object.keys(styles).length > 0) {
      return <p style={styles} />;
    }
    return null;
  },
  entityToHTML: (entity, originalText) => {
    switch (entity.type) {
      case 'LINK':
        return <a href={entity.data.url}>{originalText}</a>;
      case 'MAILMERGE':
        return <span data-mailmerge="{originalText}">{originalText}</span>;
      case 'IMAGE':
        let otherDatas = {};
        if (entity.data.height) {
          otherDatas[height] = entity.data.height;
        }
        if (entity.data.width) {
          otherDatas[width] = entity.data.width;
        }
        if (entity.data.alt) {
          otherDatas[alt] = entity.data.alt;
        }
        return <img src={entity.data.src} {...otherDatas} />;
      default:
        console.log(entity, originalText);
        break;
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
            console.log(nodeName, node, currentStyle);
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
    let entity = null;
    if (nodeName === 'a') {
      entity = createEntity('LINK', 'MUTABLE', { url: node.href });
    }
    if (nodeName === 'span' && node.dataset && node.dataset.mailmerge) {
      entity = createEntity('MAILMERGE', 'IMMUTABLE', { mailmerge: node.dataset.mailmerge });
    }
    if (nodeName === 'img') {
      entity = createEntity('IMAGE', 'MUTABLE', { src: node.src });
    }
    console.log(nodeName, entity);
    return entity;
  },
  textToEntity: (text, createEntity) => {
    const result = [];
    return result;
  },
  htmlToBlock: (nodeName, node) => {
    if (nodeName === "hr" || nodeName === "img") {
      return "atomic";
    }
    if (nodeName === 'blockquote') {
      return {
        type: 'blockquote',
        data: {},
      };
    }
    return null;
  },
};

function findMailmergeEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      const found = entityKey !== null && contentState.getEntity(entityKey).getType() === 'MAILMERGE';
      return found;
    },
    callback
  );
}

const Mailmerge = (props) => {
  const {mailmerge} = props.contentState.getEntity(props.entityKey).getData();
  return (
    <a href={mailmerge}>
      {props.children}
    </a>
  );
};

const MailmergeOptions = (props) => {
  if (props.presetTexts && Array.isArray(props.presetTexts) && props.presetTexts.length > 0) {
    return (
      [<MailMergeOption 
        icon={props.presetTextIcon} 
        options={props.presetTexts} 
        onChangeText={(text) => this.onAddPresetText(text)}
      />]
    );
  }
  return [];
}


export default class InputHtml extends Component {
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
    sizeIcon: PropTypes.element,
    fontIcon: PropTypes.element,
    colorIcon: PropTypes.element,
    imageIcon: PropTypes.element,
    presetTextIcon: PropTypes.element,
    presetTexts: PropTypes.array,
    onPresetText: PropTypes.func,
    t: PropTypes.func,
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
    sizeIcon: null,
    fontIcon: null,
    colorIcon: null,
    imageIcon: null,
    presetTextIcon: null,
    presetTexts: [],
    onPresetText: null,
    t: () => {},
  };

  constructor(props) {
    super(props);
    let content = '';
    if (this.props.value) {
      content = this.props.value;
    } else {
      content = '<p/>';
    }
    const decorator = new CompositeDecorator([
      {
        strategy: findMailmergeEntities,
        component: Mailmerge,
      },
    ]);
    console.log("FK inputHtml", this.props);
    const value = convertFromHTML(fromHtml)(content);
    this.state = {
      editorState: EditorState.createWithContent(value, decorator),
      toolbar: false,
    };
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onToolbar = this.onToolbar.bind(this);
    this.onClear = this.onClear.bind(this);
    this.onAddPresetText = this.onAddPresetText.bind(this);
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

  render() {
    //<div className={classnames('input-group', (props.error || props.warning) && 'is-invalid')}>
    const { editorState, toolbar } = this.state;
    const { t } = this.props;
    const editorToolbar = {
      options: ['inline','fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'image'],
      inline: {
        inDropdown: false,
        component: Inline,
        options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace', 'superscript', 'subscript'],
        bold: { title: t({ id: 'ui.textarea.draft.toolbar.bold', defaultMessage: 'Bold' }) }, 
        italic: { title: t({ id: 'ui.textarea.draft.toolbar.italic', defaultMessage: 'Italic' }) }, 
        underline: { title: t({ id: 'ui.textarea.draft.toolbar.underline', defaultMessage: 'Underline' }) }, 
        strikethrough: { title: t({ id: 'ui.textarea.draft.toolbar.strikethrough', defaultMessage: 'Underline' }) },
        monospace: { title: t({ id: 'ui.textarea.draft.toolbar.monospace', defaultMessage: 'monospace' }) },
        superscript: { title: t({ id: 'ui.textarea.draft.toolbar.superscript', defaultMessage: 'Superscript' }) }, 
        subscript: { title: t({ id: 'ui.textarea.draft.toolbar.subscript', defaultMessage: 'Subscript' }) },
      },
      fontSize: {
        component: FontSize,
        options: [7, 8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
        icon: this.props.sizeIcon,
      },
      fontFamily: {
        component: FontFamily,
        options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
      },
      list: {
        inDropdown: false,
        component: Inline,
        options: ['unordered', 'ordered'],
      },
      textAlign: {
        inDropdown: false,
        component: Inline,
        options: ['left', 'center', 'right'],
      },
      colorPicker: {
        component: ColorPicker,
        icon: this.props.colorIcon,
      },
      image: {
        component: Image,
        inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
        alt: { present: false, mandatory: false },
        previewImage: true,
        icon: this.props.imageIcon,
      },
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
              toolbarCustomButtons={MailmergeOptions(this.props)}
              editorState={editorState}
              wrapperClassName="form-control border-ui h-auto"
              onEditorStateChange={this.onEditorStateChange}
              onBlur={this.onChange}
            />
            <div className="input-group-append" style={appenStyle}>
              <button
                type="button"
                className={classnames(
                  'btn btn-input btn-outline-ui bg-light',
                  this.props.size === 'sm' && `btn-${this.props.size}`
                )}
                onClick={this.onToolbar}
              >
                {this.props.toolbarIcon}
              </button>
              <button
                type="button"
                className={classnames(
                  'btn btn-input btn-outline-ui bg-light',
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
