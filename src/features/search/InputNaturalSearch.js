import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { rbfIntl } from '../intl';
import { SmLoading3Dots } from '../spinner';
import { tr } from './i18n';

/**
 * La barre de recherche en langage naturel : une étincelle, une phrase, une
 * indication « Entrée ».
 *
 * Tant qu'aucun service d'interprétation n'est branché (`onNaturalLanguage`
 * absent, ou `comingSoon`), le composant est « en construction » : l'étincelle
 * affiche une notice sous le champ, rien d'autre. Dans la barre d'en-tête, Entrée
 * garde la recherche rapide actuelle via `onQuickSearch(texte, 'simple')`, pour ne
 * rien casser. Variante `card` : le bloc de la fiche de recherche, avec son bouton
 * « Remplir les critères » et son indication.
 *
 * Contrat du résultat : { filter?, plain?, values?, mode?, warnings?, explanation? },
 * voir doc/recherche/composants.md ; createNaturalLanguage (natural.js) le fabrique.
 * Les `warnings` s'affichent sous le champ (`showWarnings`), la fiche de recherche
 * préfère les montrer elle-même.
 */
const NOTICE_DELAY = 4000;

export default class InputNaturalSearch extends Component {
  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    placeholder: PropTypes.string,
    sparkleIcon: PropTypes.element.isRequired,
    kbdHint: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    variant: PropTypes.oneOf(['bar', 'card']),
    submitLabel: PropTypes.string,
    hint: PropTypes.node,
    onNaturalLanguage: PropTypes.func,
    comingSoon: PropTypes.bool,
    comingSoonMessage: PropTypes.string,
    onComingSoon: PropTypes.func,
    pending: PropTypes.bool,
    showWarnings: PropTypes.bool,
    onResult: PropTypes.func,
    onError: PropTypes.func,
    onQuickSearch: PropTypes.func,
    onChange: PropTypes.func,
    context: PropTypes.object,
    size: PropTypes.string,
    className: PropTypes.string,
    t: PropTypes.func,
  };

  static defaultProps = {
    name: 'natural',
    value: null,
    defaultValue: '',
    placeholder: '',
    kbdHint: null,
    variant: 'bar',
    submitLabel: null,
    hint: null,
    onNaturalLanguage: null,
    comingSoon: null,
    comingSoonMessage: null,
    onComingSoon: null,
    pending: null,
    showWarnings: true,
    onResult: () => {},
    onError: () => {},
    onQuickSearch: null,
    onChange: null,
    context: {},
    size: null,
    className: '',
    t: rbfIntl,
  };

  constructor(props) {
    super(props);
    this.state = { text: props.value !== null ? props.value : props.defaultValue, pending: false, notice: null, warnings: [] };
    this.timer = null;
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.interpret = this.interpret.bind(this);
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.clearTimer();
  }

  clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  isComingSoon() {
    const { comingSoon, onNaturalLanguage } = this.props;
    return comingSoon !== null ? comingSoon : typeof onNaturalLanguage !== 'function';
  }

  isPending() {
    return this.props.pending !== null ? this.props.pending : this.state.pending;
  }

  text() {
    return this.props.value !== null ? this.props.value : this.state.text;
  }

  notify(notice) {
    this.clearTimer();
    this.setState({ notice });
    if (notice) {
      this.timer = setTimeout(() => {
        this.timer = null;
        if (!this.unmounted) {
          this.setState({ notice: null });
        }
      }, NOTICE_DELAY);
    }
  }

  onChange(event) {
    this.setState({ text: event.target.value });
    if (this.props.onChange) {
      this.props.onChange({ target: { name: this.props.name, value: event.target.value } });
    }
  }

  /* Entrée : la recherche rapide si l'application la garde, sinon l'interprétation. */
  onSubmit(event) {
    if (event) {
      event.preventDefault();
    }
    if (typeof this.props.onQuickSearch === 'function') {
      this.props.onQuickSearch(this.text(), 'simple');
      return;
    }
    this.interpret();
  }

  interpret() {
    const { t, onNaturalLanguage, onComingSoon, onResult, onError, context } = this.props;
    const text = this.text();
    if (this.isComingSoon()) {
      this.notify(
        this.props.comingSoonMessage ||
          tr(t, 'rbf.search.natural.comingSoon', 'Recherche en langage naturel : en construction pour l’instant')
      );
      if (typeof onComingSoon === 'function') {
        onComingSoon(text);
      }
      return;
    }
    if (!text || text.trim() === '' || this.isPending()) {
      return;
    }
    this.notify(null);
    this.setState({ pending: true, warnings: [] });
    let promise;
    try {
      promise = Promise.resolve(onNaturalLanguage(text, { ...context, phrase: text }));
    } catch (error) {
      promise = Promise.reject(error);
    }
    promise
      .then(result => {
        if (this.unmounted) {
          return;
        }
        const warnings = this.props.showWarnings && result && Array.isArray(result.warnings) ? result.warnings : [];
        this.setState({ pending: false, warnings });
        onResult(result || {}, text);
      })
      .catch(error => {
        if (this.unmounted) {
          return;
        }
        this.setState({ pending: false });
        this.notify(tr(t, 'rbf.search.natural.error', 'L’interprétation de la phrase a échoué'));
        onError(error, text);
      });
  }

  render() {
    const { name, placeholder, sparkleIcon, variant, hint, size, className, t } = this.props;
    const comingSoon = this.isComingSoon();
    const pending = this.isPending();
    const kbdHint = this.props.kbdHint === null ? tr(t, 'rbf.search.natural.kbd', 'Entrée') : this.props.kbdHint;
    const submitLabel = this.props.submitLabel || tr(t, 'rbf.search.natural.submit', 'Remplir les critères');
    const sparkleTitle = comingSoon
      ? tr(t, 'rbf.search.natural.comingSoon', 'Recherche en langage naturel : en construction pour l’instant')
      : tr(t, 'rbf.search.natural.ask', 'Interpréter la phrase');
    /* Sous le champ : la notice (4 s), l'attente (le modèle met quelques secondes sur
       un serveur sans GPU), puis ce que l'interprétation a corrigé ou ignoré. */
    const notice = this.state.notice ? (
      <small className="rbf-natural-search-notice form-text text-warning" role="status">
        {this.state.notice}
      </small>
    ) : pending ? (
      <small className="rbf-natural-search-pending form-text text-muted" role="status">
        {tr(t, 'rbf.search.natural.pending', 'Analyse de la phrase en cours, quelques secondes…')}
      </small>
    ) : this.state.warnings.length > 0 ? (
      <ul className="rbf-natural-search-warnings small text-warning mt-1 mb-0 pl-3">
        {this.state.warnings.map((warning, i) => (
          <li key={i}>{warning}</li>
        ))}
      </ul>
    ) : null;
    const sparkle = (
      <button
        type="button"
        className={classnames('btn btn-outline-rbf bg-light text-secondary rbf-natural-search-sparkle', size && `btn-${size}`)}
        title={sparkleTitle}
        aria-label={sparkleTitle}
        disabled={pending}
        onClick={this.interpret}
      >
        {sparkleIcon}
      </button>
    );
    const input = (
      <input
        type="text"
        className={classnames('border-rbf form-control', size && `form-control-${size}`)}
        name={name}
        placeholder={placeholder}
        value={this.text()}
        onChange={this.onChange}
        disabled={pending}
        autoComplete="off"
      />
    );
    const waiting = pending && (
      <span className="input-group-text border-rbf bg-white">
        <SmLoading3Dots />
      </span>
    );

    if (variant === 'card') {
      return (
        <form className={classnames('rbf-natural-search rbf-natural-search-card', className)} onSubmit={this.onSubmit}>
          <div className="border rounded p-3 bg-white">
            <div className="input-group">
              <div className="input-group-prepend">{sparkle}</div>
              {input}
              <div className="input-group-append">
                {waiting}
                <button type="button" className={classnames('btn btn-primary', size && `btn-${size}`)} disabled={pending} onClick={this.interpret}>
                  {submitLabel}
                </button>
              </div>
            </div>
            {notice}
          </div>
          {hint && <small className="form-text text-muted mt-2">{hint}</small>}
        </form>
      );
    }
    return (
      <form className={classnames('rbf-natural-search rbf-natural-search-bar', className)} onSubmit={this.onSubmit}>
        <div className="input-group">
          <div className="input-group-prepend">{sparkle}</div>
          {input}
          {(waiting || kbdHint) && (
            <div className="input-group-append">
              {waiting || (
                <span className="input-group-text border-rbf bg-white">
                  <span className="badge badge-light border text-secondary font-weight-normal">{kbdHint}</span>
                </span>
              )}
            </div>
          )}
        </div>
        {notice}
      </form>
    );
  }
}
