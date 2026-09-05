import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Editor } from '@tiptap/core';
import { buildExtensions } from './buildExtensions';
import { cleanHtml } from './html/cleanHtml';
import { normalizeLegacyHtml } from './html/normalizeLegacyHtml';
import { serialize } from './html/serialize';

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
    /** Délai avant remontée de la saisie, en millisecondes. */
    debounce: PropTypes.number,
    /** Hauteurs de la zone d'édition. */
    minHeight: PropTypes.string,
    maxHeight: PropTypes.string,
    /** Nettoyage automatique au collage. */
    cleanOnPaste: PropTypes.bool,
    /** Variables de fusion, groupées. */
    mergeVars: PropTypes.array,
    /** Compatibilité des contenus écrits par l'ancien éditeur. */
    legacy: PropTypes.object,
    /** Options de sérialisation vers la base. */
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
    debounce: 300,
    minHeight: '8rem',
    maxHeight: '30rem',
    cleanOnPaste: true,
    mergeVars: [],
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
    this.state = { toolbar: true };

    this.flush = this.flush.bind(this);
    this.scheduleEmit = this.scheduleEmit.bind(this);
    this.onToolbar = this.onToolbar.bind(this);
    this.onClear = this.onClear.bind(this);
    this.onGlobalKeydown = this.onGlobalKeydown.bind(this);
  }

  componentDidMount() {
    this.editor = new Editor({
      element: this.contentRef.current,
      extensions: buildExtensions(this.props),
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
    });
    document.addEventListener('keydown', this.onGlobalKeydown, true);
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
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onGlobalKeydown, true);
    /* Ne jamais perdre la dernière frappe. */
    this.flush();
    if (this.debounceId) {
      clearTimeout(this.debounceId);
      this.debounceId = null;
    }
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }
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
    const html = serialize(this.editor, this.props.serializeOptions);
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
    this.setState({ toolbar: !this.state.toolbar });
  }

  onClear() {
    if (!this.editor) {
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
   * Sur une sélection : retire couleur, police et taille. Sur tout le
   * document : passe le HTML au nettoyeur en profil STRICT, en une seule
   * transaction — Ctrl+Z l'annule donc intégralement.
   */
  onClean(all) {
    if (!this.editor) {
      return;
    }
    const selection = this.editor.state.selection;
    if (!all && !selection.empty) {
      this.editor
        .chain()
        .focus()
        .unsetColor()
        .unsetFontFamily()
        .unsetFontSize()
        .run();
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

  renderAppendButton(icon, onClick, title) {
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

  render() {
    const { t, label, labelTop, required, error, warning, help, id, minHeight, maxHeight } = this.props;
    const contentStyle = { minHeight, maxHeight };
    return (
      <div className={classnames('form-group', !labelTop && 'row')}>
        {label !== '' && (
          <label htmlFor={id} className={classnames(!labelTop && 'col-xxs-w6 col-form-label')}>
            {label}
            {required && <span>&nbsp;*</span>}
          </label>
        )}
        <div className={classnames(!labelTop && 'col-xxs-w30')}>
          <div className={classnames('rbf-editor input-group', (error || warning) && 'is-invalid')}>
            <div className="rbf-editor-main form-control border-ui h-auto">
              <div className="rbf-editor-scroll" style={contentStyle} ref={this.contentRef} />
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
