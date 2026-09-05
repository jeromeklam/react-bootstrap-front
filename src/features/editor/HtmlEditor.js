import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Editor } from '@tiptap/core';
import { buildExtensions } from './buildExtensions';
import { cleanHtml } from './html/cleanHtml';
import { normalizeLegacyHtml } from './html/normalizeLegacyHtml';
import { serialize } from './html/serialize';
import { formatHtml, tagSignature, textSignature, reserialize } from './html/sourceHelpers';
import { resolveToolbarConfig } from './toolbarPresets';
import { defaultIcons } from './defaultIcons';
import Toolbar from './Toolbar';
import LinkDialog from './LinkDialog';
import ImageDialog from './ImageDialog';
import SourceView from './SourceView';

/**
 * Champ d'édition HTML.
 *
 * Remplaçant de `features/draft/InputHtml`. Le contrat d'appel est strictement
 * préservé — `label`, `name`, `value`, `onChange({target:{name,value}})`,
 * `required`, `error`, `labelTop`, `disabled`, `size`, `help` — pour qu'aucun
 * formulaire appelant n'ait de code à changer.
 *
 * L'éditeur est instancié via l'API « vanilla » de `@tiptap/core` et non via
 * `@tiptap/react`, qui exige React 17 : la librairie cible React 16.
 */
export default class HtmlEditor extends Component {
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
    error: PropTypes.node,
    warning: PropTypes.node,
    help: PropTypes.node,
    placeholder: PropTypes.string,
    /** Icônes de la barre, fusionnées avec le repli textuel. */
    icons: PropTypes.object,
    /** Barre visible d'emblée, contrairement à l'ancien composant. */
    toolbar: PropTypes.bool,
    toolbarPreset: PropTypes.oneOf(['full', 'email', 'simple', 'minimal']),
    toolbarConfig: PropTypes.array,
    /** Autorise la bascule vers le HTML brut. */
    allowSource: PropTypes.bool,
    /** Délai avant remontée de la saisie, en millisecondes. */
    debounce: PropTypes.number,
    minHeight: PropTypes.string,
    maxHeight: PropTypes.string,
    cleanOnPaste: PropTypes.bool,
    /** Variables de fusion, groupées. */
    mergeVars: PropTypes.array,
    /** @deprecated ancienne forme plate, normalisée vers mergeVars. */
    presetTexts: PropTypes.array,
    /** (File) => Promise<url> ; absente, l'insertion d'image se fait par adresse. */
    onUploadImage: PropTypes.func,
    maxImageSize: PropTypes.number,
    legacy: PropTypes.object,
    serializeOptions: PropTypes.object,
    /** Icônes des deux boutons historiques, conservées pour compatibilité. */
    clearIcon: PropTypes.element,
    toolbarIcon: PropTypes.element,
    t: PropTypes.func,
  };

  static defaultProps = {
    id: '',
    label: '',
    value: '',
    size: '',
    labelTop: true,
    onChange: () => {},
    required: false,
    disabled: false,
    error: null,
    warning: null,
    help: null,
    placeholder: '',
    icons: null,
    toolbar: true,
    toolbarPreset: 'full',
    toolbarConfig: null,
    allowSource: true,
    debounce: 300,
    minHeight: '8rem',
    maxHeight: '30rem',
    cleanOnPaste: true,
    mergeVars: [],
    presetTexts: [],
    onUploadImage: null,
    maxImageSize: 524288,
    legacy: null,
    serializeOptions: null,
    clearIcon: null,
    toolbarIcon: null,
    /* Le défaut historique `() => {}` rendait tous les title indéfinis :
       aucune infobulle n'a jamais été affichée. On rend le message par défaut. */
    t: descriptor => (descriptor && descriptor.defaultMessage) || '',
  };

  constructor(props) {
    super(props);
    this.contentRef = React.createRef();
    this.editor = null;
    /** Dernier HTML que NOUS avons émis, pour ignorer notre propre écho. */
    this.lastEmitted = null;
    this.debounceId = null;
    this.rafId = null;
    this.state = {
      toolbar: props.toolbar,
      mode: 'wysiwyg',
      source: '',
      sourceWarning: null,
      sourceBackup: null,
      dialog: null,
      linkState: null,
      tick: 0,
    };

    this.flush = this.flush.bind(this);
    this.scheduleEmit = this.scheduleEmit.bind(this);
    this.scheduleToolbarRefresh = this.scheduleToolbarRefresh.bind(this);
    this.onToolbar = this.onToolbar.bind(this);
    this.onClear = this.onClear.bind(this);
    this.onClean = this.onClean.bind(this);
    this.onGlobalKeydown = this.onGlobalKeydown.bind(this);
    this.onOpenLink = this.onOpenLink.bind(this);
    this.onApplyLink = this.onApplyLink.bind(this);
    this.onRemoveLink = this.onRemoveLink.bind(this);
    this.onOpenImage = this.onOpenImage.bind(this);
    this.onApplyImage = this.onApplyImage.bind(this);
    this.onCloseDialog = this.onCloseDialog.bind(this);
    this.onToggleSource = this.onToggleSource.bind(this);
    this.onSourceChange = this.onSourceChange.bind(this);
    this.onRestoreSource = this.onRestoreSource.bind(this);
  }

  componentDidMount() {
    this.editor = new Editor({
      element: this.contentRef.current,
      extensions: buildExtensions(this.getEditorOptions()),
      content: normalizeLegacyHtml(this.props.value || '', this.props.legacy),
      editable: !this.props.disabled,
      editorProps: {
        attributes: {
          class: 'rbf-editor-content',
          role: 'textbox',
          'aria-multiline': 'true',
        },
      },
      onUpdate: this.scheduleEmit,
      onBlur: this.flush,
      onTransaction: this.scheduleToolbarRefresh,
    });
    document.addEventListener('keydown', this.onGlobalKeydown, true);
    /* La barre lit l'état de l'éditeur, qui n'existe pas au premier rendu. */
    this.forceUpdate();
  }

  componentDidUpdate(prevProps) {
    if (!this.editor) {
      return;
    }
    if (this.props.disabled !== prevProps.disabled) {
      this.editor.setEditable(!this.props.disabled);
    }
    const nameChanged = this.props.name !== prevProps.name;
    const valueChanged = this.props.value !== prevProps.value;
    if (!nameChanged && !valueChanged) {
      return;
    }
    const next = this.props.value || '';
    /* Notre propre écho : le formulaire nous renvoie ce que nous venons
       d'émettre. Recharger le contenu ici perdrait la position du curseur à
       chaque frappe — c'est le piège n°1 de l'intégration. */
    if (!nameChanged && next === this.lastEmitted) {
      return;
    }
    if (!nameChanged && this.isEquivalent(next, this.editor.getHTML())) {
      return;
    }
    /* emitUpdate = false : charger un contenu existant ne doit JAMAIS
       déclencher onChange, sinon ouvrir puis fermer un formulaire réécrirait
       la base en silence avec la conversion de l'éditeur. */
    this.editor.commands.setContent(normalizeLegacyHtml(next, this.props.legacy), false);
    this.lastEmitted = null;
    if (nameChanged && this.state.mode === 'source') {
      this.setState({ mode: 'wysiwyg', sourceWarning: null, sourceBackup: null });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onGlobalKeydown, true);
    /* Ne jamais perdre la dernière frappe. */
    this.flush();
    if (this.debounceId) {
      clearTimeout(this.debounceId);
      this.debounceId = null;
    }
    if (this.rafId && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }
  }

  getEditorOptions() {
    return {
      placeholder: this.props.placeholder,
      mergeVars: this.getMergeVars(),
      cleanOnPaste: this.props.cleanOnPaste,
    };
  }

  getMergeVars() {
    const { mergeVars, presetTexts } = this.props;
    if (mergeVars && mergeVars.length > 0) {
      return mergeVars;
    }
    return presetTexts || [];
  }

  getIcons() {
    if (!this.icons || this.iconsSource !== this.props.icons) {
      this.iconsSource = this.props.icons;
      this.icons = this.props.icons ? { ...defaultIcons, ...this.props.icons } : { ...defaultIcons };
      /* Compatibilité : les deux icônes historiques alimentent la barre si
         l'application ne fournit pas encore de map complète. */
      if (this.props.clearIcon && !this.icons.formatClear) {
        this.icons.formatClear = this.props.clearIcon;
      }
    }
    return this.icons;
  }

  /**
   * Comparaison tolérante aux blancs entre balises : évite de recharger
   * l'éditeur — et de perdre le curseur — pour une différence cosmétique.
   */
  isEquivalent(a, b) {
    const normalize = html =>
      String(html || '')
        .replace(/>\s+</g, '><')
        .trim();
    return normalize(a) === normalize(b);
  }

  scheduleEmit() {
    if (this.debounceId) {
      clearTimeout(this.debounceId);
    }
    this.debounceId = setTimeout(this.flush, this.props.debounce);
  }

  /**
   * Rafraîchit l'état actif de la barre, au plus une fois par image :
   * sans cela une frappe rapide re-rendrait la barre soixante fois par seconde.
   */
  scheduleToolbarRefresh() {
    if (this.rafId || typeof requestAnimationFrame === 'undefined') {
      return;
    }
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      if (this.editor) {
        this.setState(state => ({ tick: state.tick + 1 }));
      }
    });
  }

  /**
   * Remonte immédiatement la saisie au formulaire.
   * Appelée au blur, au démontage, sur Ctrl/Cmd+S et après chaque commande.
   */
  flush() {
    if (this.debounceId) {
      clearTimeout(this.debounceId);
      this.debounceId = null;
    }
    if (!this.editor) {
      return;
    }
    const html =
      this.state.mode === 'source' ? this.state.source : serialize(this.editor, this.props.serializeOptions);
    if (html === this.lastEmitted) {
      return;
    }
    this.lastEmitted = html;
    this.props.onChange({
      target: { name: this.props.name, value: html, type: 'text' },
    });
  }

  /**
   * L'ancien composant ne remontait la saisie qu'au blur : un raccourci de
   * sauvegarde depuis le champ perdait la dernière frappe.
   */
  onGlobalKeydown(ev) {
    if ((ev.ctrlKey || ev.metaKey) && (ev.key === 's' || ev.key === 'S')) {
      this.flush();
    }
  }

  onToolbar() {
    this.setState(state => ({ toolbar: !state.toolbar }));
  }

  onClear() {
    if (!this.editor) {
      return;
    }
    if (this.state.mode === 'source') {
      this.setState({ source: '' }, this.flush);
      return;
    }
    this.editor
      .chain()
      .focus()
      .clearContent(true)
      .run();
    this.flush();
  }

  /**
   * Nettoyage de la mise en forme.
   *
   * Deux commandes distinctes, parce que dans l'immense majorité des cas on
   * veut retirer la couleur et la police SANS perdre le gras :
   *  - 'soft' : couleur, police, taille ;
   *  - 'all'  : en plus, toutes les marques et les blocs.
   *
   * Sans sélection, l'opération porte sur tout le document et passe par le
   * nettoyeur en profil STRICT. C'est une transaction unique : Ctrl+Z l'annule
   * intégralement, ce qui dispense de toute demande de confirmation.
   */
  onClean(mode) {
    if (this.state.mode === 'source') {
      this.setState(state => ({ source: formatHtml(cleanHtml(state.source, 'strict')) }), this.flush);
      return;
    }
    if (!this.editor) {
      return;
    }
    const empty = this.editor.state.selection.empty;
    if (!empty) {
      const chain = this.editor
        .chain()
        .focus()
        .unsetColor()
        .unsetFontFamily()
        .unsetFontSize();
      if (mode === 'all') {
        chain.unsetAllMarks().clearNodes();
      }
      chain.run();
    } else {
      const cleaned = cleanHtml(this.editor.getHTML(), 'strict');
      this.editor
        .chain()
        .focus()
        .setContent(cleaned, false)
        .run();
    }
    this.flush();
  }

  onOpenLink() {
    if (!this.editor) {
      return;
    }
    const attributes = this.editor.getAttributes('link');
    const { from, to, empty } = this.editor.state.selection;
    this.setState({
      dialog: 'link',
      linkState: {
        url: attributes.href || '',
        target: attributes.target || '',
        text: empty ? '' : this.editor.state.doc.textBetween(from, to, ' '),
        hasSelection: !empty,
        canRemove: this.editor.isActive('link'),
      },
    });
  }

  onApplyLink(link) {
    if (!this.editor) {
      return;
    }
    const attributes = { href: link.url };
    if (link.target) {
      attributes.target = link.target;
      attributes.rel = 'noopener noreferrer';
    }
    const chain = this.editor.chain().focus();
    if (this.state.linkState && this.state.linkState.hasSelection) {
      chain.extendMarkRange('link').setLink(attributes);
    } else {
      const label = link.text && link.text !== '' ? link.text : link.url;
      chain.insertContent({
        type: 'text',
        text: label,
        marks: [{ type: 'link', attrs: attributes }],
      });
    }
    chain.run();
    this.setState({ dialog: null, linkState: null }, this.flush);
  }

  onRemoveLink() {
    if (!this.editor) {
      return;
    }
    this.editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .unsetLink()
      .run();
    this.setState({ dialog: null, linkState: null }, this.flush);
  }

  onOpenImage() {
    this.setState({ dialog: 'image' });
  }

  onApplyImage(image) {
    if (!this.editor) {
      return;
    }
    const attributes = { src: image.src, alt: image.alt || '' };
    if (image.width) {
      attributes.width = image.width;
    }
    this.editor
      .chain()
      .focus()
      .setImage(attributes)
      .run();
    this.setState({ dialog: null }, this.flush);
  }

  onCloseDialog() {
    this.setState({ dialog: null, linkState: null });
    if (this.editor) {
      this.editor.commands.focus();
    }
  }

  /**
   * Bascule entre l'éditeur riche et le HTML brut.
   *
   * L'instance TipTap n'est jamais détruite — son conteneur est simplement
   * masqué — sinon chaque aller-retour effacerait l'historique d'annulation.
   */
  onToggleSource() {
    if (this.state.mode === 'wysiwyg') {
      this.flush();
      this.setState({
        mode: 'source',
        source: formatHtml(this.editor ? this.editor.getHTML() : ''),
        sourceWarning: null,
      });
      return;
    }
    this.applySource();
  }

  applySource() {
    const source = this.state.source;
    if (!this.editor) {
      this.setState({ mode: 'wysiwyg' });
      return;
    }
    const balanced = tagSignature(source) === tagSignature(reserialize(source));
    this.editor.commands.setContent(source, false);
    const lost = textSignature(reserialize(source)) !== textSignature(this.editor.getHTML());
    this.setState(
      {
        mode: 'wysiwyg',
        sourceWarning: !balanced ? 'unbalanced' : lost ? 'unsupported' : null,
        sourceBackup: !balanced || lost ? source : null,
      },
      this.flush,
    );
  }

  onSourceChange(ev) {
    this.setState({ source: ev.target.value }, this.scheduleEmit);
  }

  onRestoreSource() {
    this.setState(state => ({
      mode: 'source',
      source: state.sourceBackup || state.source,
      sourceWarning: null,
    }));
  }

  renderAppendButton(icon, onClick, title) {
    if (!icon) {
      return null;
    }
    return (
      <button
        type="button"
        title={title}
        className={classnames('btn btn-input btn-outline-ui bg-light', this.props.size === 'sm' && 'btn-sm')}
        onMouseDown={ev => ev.preventDefault()}
        onClick={onClick}
      >
        {icon}
      </button>
    );
  }

  renderDialog() {
    const { t } = this.props;
    if (this.state.dialog === 'link') {
      const link = this.state.linkState || {};
      return (
        <LinkDialog
          t={t}
          url={link.url}
          text={link.text}
          target={link.target}
          hasSelection={link.hasSelection}
          canRemove={link.canRemove}
          onApply={this.onApplyLink}
          onRemove={this.onRemoveLink}
          onCancel={this.onCloseDialog}
        />
      );
    }
    if (this.state.dialog === 'image') {
      return (
        <ImageDialog
          t={t}
          onUpload={this.props.onUploadImage}
          maxImageSize={this.props.maxImageSize}
          onApply={this.onApplyImage}
          onCancel={this.onCloseDialog}
        />
      );
    }
    return null;
  }

  render() {
    const {
      t,
      label,
      labelTop,
      required,
      error,
      warning,
      help,
      id,
      minHeight,
      maxHeight,
      disabled,
      allowSource,
      toolbarPreset,
      toolbarConfig,
      size,
    } = this.props;
    const contentStyle = { minHeight, maxHeight };
    const sourceMode = this.state.mode === 'source';
    let config = resolveToolbarConfig(toolbarPreset, toolbarConfig);
    if (!allowSource) {
      config = config.map(group => group.filter(key => key !== 'source')).filter(group => group.length > 0);
    }

    return (
      <div className={classnames('form-group', !labelTop && 'row')}>
        {label !== '' && (
          <label htmlFor={id} className={classnames(!labelTop && 'col-xxs-w6 col-form-label')}>
            {label}
            {required && <span>&nbsp;*</span>}
          </label>
        )}
        <div className={classnames(!labelTop && 'col-xxs-w30')}>
          <div
            className={classnames(
              'rbf-editor input-group',
              disabled && 'rbf-editor-disabled',
              (error || warning) && 'is-invalid',
            )}
          >
            <div className="rbf-editor-main form-control border-ui h-auto">
              {this.state.toolbar && !disabled && (
                <Toolbar
                  editor={this.editor}
                  config={config}
                  icons={this.getIcons()}
                  t={t}
                  size={size === 'sm' ? 'sm' : 'sm'}
                  mergeVars={this.getMergeVars()}
                  sourceMode={sourceMode}
                  onCommand={this.flush}
                  onLink={this.onOpenLink}
                  onImage={this.onOpenImage}
                  onClean={this.onClean}
                  onSource={this.onToggleSource}
                />
              )}
              {this.renderDialog()}
              {this.state.sourceWarning && !sourceMode && (
                <div className="alert alert-warning alert-sm rbf-editor-source-warning" role="alert">
                  <span>
                    {this.state.sourceWarning === 'unbalanced'
                      ? t({
                          id: 'ui.editor.source.unbalanced',
                          defaultMessage: 'The HTML was not balanced and has been corrected automatically.',
                        })
                      : t({
                          id: 'ui.editor.source.unsupported',
                          defaultMessage: 'Some tags are not supported by the editor and have been removed.',
                        })}
                  </span>
                  <button type="button" className="btn btn-sm btn-link" onClick={this.onRestoreSource}>
                    {t({ id: 'ui.editor.source.back', defaultMessage: 'Back to the source' })}
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-link"
                    onClick={() => this.setState({ sourceWarning: null, sourceBackup: null })}
                  >
                    {t({ id: 'ui.editor.source.dismiss', defaultMessage: 'Keep the correction' })}
                  </button>
                </div>
              )}
              {/* Le conteneur TipTap est masqué, jamais démonté : le détruire
                  effacerait l'historique d'annulation à chaque aller-retour. */}
              <div
                className={classnames('rbf-editor-scroll', sourceMode && 'd-none')}
                style={contentStyle}
                ref={this.contentRef}
              />
              {sourceMode && (
                <SourceView
                  t={t}
                  value={this.state.source}
                  onChange={this.onSourceChange}
                  style={contentStyle}
                />
              )}
            </div>
            <div className="input-group-append rbf-editor-append">
              {this.renderAppendButton(
                this.props.toolbarIcon,
                this.onToolbar,
                t({ id: 'ui.editor.toolbar.toolbar', defaultMessage: 'Show or hide the toolbar' }),
              )}
              {this.renderAppendButton(
                this.props.clearIcon,
                this.onClear,
                t({ id: 'ui.editor.toolbar.clear', defaultMessage: 'Clear the content' }),
              )}
            </div>
          </div>
          {help && help !== '' && <small className="form-text text-muted">{help}</small>}
          {error && <div className="invalid-feedback">{error}</div>}
          {warning && <div className="invalid-feedback">{warning}</div>}
        </div>
      </div>
    );
  }
}
