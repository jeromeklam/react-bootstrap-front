import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ToolbarButton from './ToolbarButton';
import ToolbarGroup from './ToolbarGroup';
import ToolbarDropdown from './ToolbarDropdown';
import MergeMenu, { normalizeMergeVars } from './MergeMenu';
import { FONT_SIZES, FONT_FAMILIES, COLORS, OPTIONAL_KEYS } from './toolbarPresets';

/**
 * Barre d'outils.
 *
 * Elle ne détient aucun état : l'état actif est lu directement dans l'éditeur
 * (`editor.isActive(...)`), et le parent la re-rend à chaque transaction.
 *
 * Toute commande commence par `.focus()`, sans quoi un clic passé par un menu
 * déroulant appliquerait la commande hors de la sélection.
 */
export default class Toolbar extends Component {
  static propTypes = {
    editor: PropTypes.object,
    config: PropTypes.array.isRequired,
    icons: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    size: PropTypes.string,
    mergeVars: PropTypes.array,
    sourceMode: PropTypes.bool,
    /** Appelé après chaque commande, pour remonter la saisie au formulaire. */
    onCommand: PropTypes.func.isRequired,
    onLink: PropTypes.func.isRequired,
    onImage: PropTypes.func.isRequired,
    onClean: PropTypes.func.isRequired,
    onSource: PropTypes.func.isRequired,
  };

  static defaultProps = {
    editor: null,
    size: 'sm',
    mergeVars: [],
    sourceMode: false,
  };

  constructor(props) {
    super(props);
    this.run = this.run.bind(this);
  }

  /**
   * Exécute une commande puis remonte la saisie.
   */
  run(build) {
    const { editor } = this.props;
    if (!editor) {
      return;
    }
    build(editor.chain().focus()).run();
    this.props.onCommand();
  }

  isActive(...args) {
    const { editor } = this.props;
    return !!editor && editor.isActive(...args);
  }

  label(id, defaultMessage) {
    return this.props.t({ id: 'ui.editor.toolbar.' + id, defaultMessage });
  }

  renderSimple(key, title, icon, active, onClick, disabled) {
    return (
      <ToolbarButton
        key={key}
        icon={icon}
        title={title}
        active={active}
        disabled={disabled}
        size={this.props.size}
        onClick={onClick}
      />
    );
  }

  renderColor(key) {
    const { icons, editor } = this.props;
    const current = editor ? editor.getAttributes('textStyle').color : null;
    return (
      <ToolbarDropdown
        key={key}
        icon={icons.color}
        title={this.label('color', 'Text color')}
        active={!!current}
        size={this.props.size}
      >
        <div className="rbf-editor-colors">
          <div className="rbf-editor-swatches">
            {COLORS.map(color => (
              <button
                key={color}
                type="button"
                className="rbf-editor-swatch"
                style={{ backgroundColor: color }}
                title={color}
                onMouseDown={ev => ev.preventDefault()}
                onClick={() => this.run(chain => chain.setColor(color))}
              />
            ))}
          </div>
          <button
            type="button"
            className="dropdown-item"
            onMouseDown={ev => ev.preventDefault()}
            onClick={() => this.run(chain => chain.unsetColor())}
          >
            {this.label('colorReset', 'Default color')}
          </button>
        </div>
      </ToolbarDropdown>
    );
  }

  renderFontSize(key) {
    const { icons, editor } = this.props;
    const current = editor ? editor.getAttributes('textStyle').fontSize : null;
    return (
      <ToolbarDropdown
        key={key}
        icon={icons.fontSize}
        title={this.label('fontSize', 'Font size')}
        active={!!current}
        size={this.props.size}
      >
        <div className="rbf-editor-sizes">
          {FONT_SIZES.map(size => (
            <button
              key={size}
              type="button"
              className="dropdown-item"
              style={{ fontSize: size }}
              onMouseDown={ev => ev.preventDefault()}
              onClick={() => this.run(chain => chain.setFontSize(size))}
            >
              {size}
            </button>
          ))}
          <button
            type="button"
            className="dropdown-item"
            onMouseDown={ev => ev.preventDefault()}
            onClick={() => this.run(chain => chain.unsetFontSize())}
          >
            {this.label('fontSizeReset', 'Default size')}
          </button>
        </div>
      </ToolbarDropdown>
    );
  }

  renderFontFamily(key) {
    const { icons, editor } = this.props;
    const current = editor ? editor.getAttributes('textStyle').fontFamily : null;
    return (
      <ToolbarDropdown
        key={key}
        icon={icons.fontFamily}
        title={this.label('fontFamily', 'Font')}
        active={!!current}
        size={this.props.size}
      >
        <div className="rbf-editor-fonts">
          {FONT_FAMILIES.map(font => (
            <button
              key={font}
              type="button"
              className="dropdown-item"
              style={{ fontFamily: font }}
              onMouseDown={ev => ev.preventDefault()}
              onClick={() => this.run(chain => chain.setFontFamily(font))}
            >
              {font}
            </button>
          ))}
          <button
            type="button"
            className="dropdown-item"
            onMouseDown={ev => ev.preventDefault()}
            onClick={() => this.run(chain => chain.unsetFontFamily())}
          >
            {this.label('fontFamilyReset', 'Default font')}
          </button>
        </div>
      </ToolbarDropdown>
    );
  }

  renderMergeVar(key) {
    const { icons, t, mergeVars } = this.props;
    const groups = normalizeMergeVars(mergeVars, t({ id: 'ui.editor.mergevar.title', defaultMessage: 'Variables' }));
    if (groups.length === 0) {
      return null;
    }
    return (
      <ToolbarDropdown
        key={key}
        icon={icons.mergeVar}
        title={this.label('mergeVar', 'Insert a merge variable')}
        size={this.props.size}
        className="rbf-editor-dropdown-wide"
      >
        <MergeMenu
          groups={groups}
          t={t}
          onSelect={item =>
            /* Insertion en texte brut : le HTML produit reste identique à celui
               de l'ancien éditeur, aucune migration ni changement côté serveur. */
            this.run(chain => chain.insertContent({ type: 'text', text: item.code }))
          }
        />
      </ToolbarDropdown>
    );
  }

  renderKey(key) {
    const { icons, editor } = this.props;
    const can = editor ? editor.can() : null;

    switch (key) {
      case 'undo':
        return this.renderSimple(key, this.label('undo', 'Undo'), icons.undo, false, () => this.run(c => c.undo()), !can || !can.undo());
      case 'redo':
        return this.renderSimple(key, this.label('redo', 'Redo'), icons.redo, false, () => this.run(c => c.redo()), !can || !can.redo());
      case 'paragraph':
        return this.renderSimple(key, this.label('paragraph', 'Paragraph'), icons.paragraph, this.isActive('paragraph'), () =>
          this.run(c => c.setParagraph()),
        );
      case 'heading1':
      case 'heading2':
      case 'heading3': {
        const level = parseInt(key.slice(-1), 10);
        return this.renderSimple(
          key,
          this.label(key, 'Heading ' + level),
          icons[key],
          this.isActive('heading', { level }),
          () => this.run(c => c.toggleHeading({ level })),
        );
      }
      case 'bold':
        return this.renderSimple(key, this.label('bold', 'Bold'), icons.bold, this.isActive('bold'), () => this.run(c => c.toggleBold()));
      case 'italic':
        return this.renderSimple(key, this.label('italic', 'Italic'), icons.italic, this.isActive('italic'), () =>
          this.run(c => c.toggleItalic()),
        );
      case 'underline':
        return this.renderSimple(key, this.label('underline', 'Underline'), icons.underline, this.isActive('underline'), () =>
          this.run(c => c.toggleUnderline()),
        );
      case 'strike':
        return this.renderSimple(key, this.label('strike', 'Strikethrough'), icons.strike, this.isActive('strike'), () =>
          this.run(c => c.toggleStrike()),
        );
      case 'subscript':
        return this.renderSimple(key, this.label('subscript', 'Subscript'), icons.subscript, this.isActive('subscript'), () =>
          this.run(c => c.toggleSubscript()),
        );
      case 'superscript':
        return this.renderSimple(key, this.label('superscript', 'Superscript'), icons.superscript, this.isActive('superscript'), () =>
          this.run(c => c.toggleSuperscript()),
        );
      case 'bulletList':
        return this.renderSimple(key, this.label('bulletList', 'Bullet list'), icons.bulletList, this.isActive('bulletList'), () =>
          this.run(c => c.toggleBulletList()),
        );
      case 'orderedList':
        return this.renderSimple(key, this.label('orderedList', 'Numbered list'), icons.orderedList, this.isActive('orderedList'), () =>
          this.run(c => c.toggleOrderedList()),
        );
      case 'blockquote':
        return this.renderSimple(key, this.label('blockquote', 'Quote'), icons.blockquote, this.isActive('blockquote'), () =>
          this.run(c => c.toggleBlockquote()),
        );
      case 'horizontalRule':
        return this.renderSimple(key, this.label('horizontalRule', 'Horizontal rule'), icons.horizontalRule, false, () =>
          this.run(c => c.setHorizontalRule()),
        );
      case 'alignLeft':
      case 'alignCenter':
      case 'alignRight':
      case 'alignJustify': {
        const align = key.slice(5).toLowerCase();
        return this.renderSimple(key, this.label(key, 'Align ' + align), icons[key], this.isActive({ textAlign: align }), () =>
          this.run(c => c.setTextAlign(align)),
        );
      }
      case 'color':
        return this.renderColor(key);
      case 'fontSize':
        return this.renderFontSize(key);
      case 'fontFamily':
        return this.renderFontFamily(key);
      case 'link':
        return this.renderSimple(key, this.label('link', 'Insert a link'), icons.link, this.isActive('link'), this.props.onLink);
      case 'unlink':
        return this.renderSimple(
          key,
          this.label('unlink', 'Remove the link'),
          icons.unlink,
          false,
          () => this.run(c => c.unsetLink()),
          !this.isActive('link'),
        );
      case 'image':
        return this.renderSimple(key, this.label('image', 'Insert an image'), icons.image, false, this.props.onImage);
      case 'mergeVar':
        return this.renderMergeVar(key);
      case 'clean':
        return this.renderSimple(key, this.label('clean', 'Clean up formatting'), icons.clean, false, () => this.props.onClean('soft'));
      case 'formatClear':
        return this.renderSimple(key, this.label('formatClear', 'Remove all formatting'), icons.formatClear, false, () =>
          this.props.onClean('all'),
        );
      case 'source':
        return this.renderSimple(
          key,
          this.label('source', 'HTML source'),
          icons.source,
          this.props.sourceMode,
          this.props.onSource,
        );
      default:
        return null;
    }
  }

  render() {
    const { config, sourceMode } = this.props;
    return (
      <div className="rbf-editor-toolbar d-flex flex-wrap align-items-center" role="toolbar">
        {config.map((group, index) => {
          /* En vue source, seuls le nettoyage et le retour au mode riche ont
             un sens : les commandes de mise en forme n'ont pas de sélection. */
          const keys = sourceMode ? group.filter(key => key === 'source' || key === 'clean') : group;
          const buttons = keys.map(key => this.renderKey(key)).filter(Boolean);
          if (buttons.length === 0) {
            return null;
          }
          const optional = keys.every(key => OPTIONAL_KEYS.indexOf(key) !== -1);
          return (
            <ToolbarGroup key={index} optional={optional}>
              {buttons}
            </ToolbarGroup>
          );
        })}
      </div>
    );
  }
}
