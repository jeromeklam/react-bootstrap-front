import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { rbfIntl } from '../intl';
import { SmLoading3Dots } from '../spinner';
import { Dropdown } from '../basic';
import { tr } from './i18n';
import { criteriaToFilter } from './criteria';
import NaturalVocabularyForm from './NaturalVocabularyForm';
import SearchSummary from './SearchSummary';

/**
 * La barre de recherche en langage naturel : une étincelle, une phrase, un
 * bouton « Rechercher » (vert, de la hauteur et de la police du champ) qui soumet la barre.
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
 * préfère les montrer elle-même. Avec `vocabulary` ({ onTry, onSave, catalog,
 * subject, maxLength }), chaque morceau non compris devient un lien « Expliquer
 * « … » » qui ouvre NaturalVocabularyForm ; une fois le mot enregistré, la demande
 * repart. Dans la barre (en-tête de liste, 50 px), tout cela vit dans un panneau
 * flottant sous le champ ; dans la carte, en ligne.
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
    vocabulary: PropTypes.object,
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
    vocabulary: null,
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
    this.state = { text: props.value !== null ? props.value : props.defaultValue, pending: false, notice: null, warnings: [], unmatched: [], interpreted: null, explaining: null, panel: false };
    this.timer = null;
    this.groupRef = React.createRef();
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.interpret = this.interpret.bind(this);
    this.closePanel = this.closePanel.bind(this);
    this.onExplain = this.onExplain.bind(this);
    this.onVocabularySave = this.onVocabularySave.bind(this);
    this.onPanelKeyDown = this.onPanelKeyDown.bind(this);
  }

  /* Phrase vidée par l'application (contrôlée) : plus rien à expliquer ni à signaler. */
  componentDidUpdate(prevProps) {
    if (this.props.value !== null && prevProps.value && !this.props.value && (this.state.panel || this.state.warnings.length > 0 || this.state.unmatched.length > 0)) {
      this.setState({ warnings: [], unmatched: [], interpreted: null, explaining: null, panel: false });
    }
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

  /* Entrée : la recherche rapide si l'application la garde, sinon l'interprétation.
     L'événement ne remonte pas : dans la fiche de recherche, la carte vit dans le
     formulaire de la fiche, qui lancerait la recherche. */
  onSubmit(event) {
    if (event) {
      event.preventDefault();
      if (typeof event.stopPropagation === 'function') {
        event.stopPropagation();
      }
    }
    if (typeof this.props.onQuickSearch === 'function') {
      this.props.onQuickSearch(this.text(), 'simple');
      return;
    }
    this.interpret();
  }

  /* Dans la carte (un div, pas un form : elle est déjà dans le formulaire de la
     fiche), Entrée vaut soumission. */
  onKeyDown(event) {
    if (event.key === 'Enter') {
      this.onSubmit(event);
    }
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
    this.setState({ pending: true, warnings: [], unmatched: [], interpreted: null, explaining: null, panel: false });
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
        const unmatched = this.props.vocabulary && result && Array.isArray(result.unmatched) ? result.unmatched : [];
        /* Avec un vocabulaire, le panneau s'ouvre après chaque interprétation : ce qui a
           été compris, en clair, et de quoi expliquer un mot — même quand tout semble
           aller (« un gibbon » pris pour le nom d'un animal ne lève aucun avertissement). */
        const interpreted = this.props.vocabulary && result && Array.isArray(result.criteria) ? result : null;
        this.setState({ pending: false, warnings, unmatched, interpreted, panel: warnings.length > 0 || unmatched.length > 0 || !!interpreted });
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

  closePanel() {
    this.setState({ panel: false, explaining: null });
  }

  onPanelKeyDown(event) {
    if (event.key === 'Escape') {
      this.closePanel();
    }
  }

  onExplain(term) {
    this.setState({ explaining: term, panel: true });
  }

  /* Le mot enregistré, la même demande repart : le modèle le connaît maintenant. */
  onVocabularySave(entry) {
    return Promise.resolve(this.props.vocabulary.onSave(entry)).then(() => {
      if (!this.unmounted) {
        this.setState({ explaining: null, panel: false });
        this.interpret();
      }
    });
  }

  vocabularyCatalog() {
    const { vocabulary } = this.props;
    if (!vocabulary) {
      return [];
    }
    return typeof vocabulary.catalog === 'function' ? vocabulary.catalog() : vocabulary.catalog || [];
  }

  /* Ce qui suit le champ : les avertissements, les liens « Expliquer », ou la fiche
     d'explication. Null s'il n'y a rien à montrer. */
  renderPanel() {
    const { vocabulary, variant, t, size } = this.props;
    const { warnings, unmatched, explaining, interpreted } = this.state;
    if (explaining !== null && vocabulary) {
      return (
        <NaturalVocabularyForm
          key={explaining}
          term={explaining}
          phrase={this.text()}
          onTry={vocabulary.onTry}
          onSave={this.onVocabularySave}
          onCancel={this.closePanel}
          catalog={this.vocabularyCatalog()}
          subject={vocabulary.subject || null}
          maxLength={vocabulary.maxLength || 250}
          size={size || 'sm'}
          t={t}
        />
      );
    }
    /* Dans la barre, la phrase en clair des seuls critères interprétés : la fiche a
       déjà la sienne en pied. */
    let understood = null;
    if (variant !== 'card' && interpreted && interpreted.criteria.length > 0) {
      const catalog = this.vocabularyCatalog();
      understood = (
        <div className="rbf-natural-search-understood small">
          <SearchSummary variant="inline" filter={criteriaToFilter(interpreted.criteria, interpreted.mode, catalog)} catalog={catalog} subject={vocabulary.subject || null} withDefaults={false} t={t} />
        </div>
      );
    }
    const list = warnings.length > 0 && (
      <ul className="rbf-natural-search-warnings small text-warning mt-1 mb-0 pl-3">
        {warnings.map((warning, i) => (
          <li key={i}>{warning}</li>
        ))}
      </ul>
    );
    /* Un lien par morceau non compris, et toujours un lien libre : le modèle ne
       signale pas tout ce qu'il traduit de travers (« banlieue » en codes postaux). */
    const explain = vocabulary && (
      <div className="rbf-natural-search-explain small mt-1">
        {unmatched.map(term => (
          <button key={term} type="button" className="btn btn-link btn-sm p-0 mr-3" onClick={() => this.onExplain(term)}>
            {tr(t, 'rbf.search.vocabulary.explain', 'Expliquer « {term} »…', { term })}
          </button>
        ))}
        <button type="button" className="btn btn-link btn-sm p-0 mr-3 text-muted" onClick={() => this.onExplain('')}>
          {tr(t, unmatched.length > 0 ? 'rbf.search.vocabulary.explainOther' : 'rbf.search.vocabulary.explainWord', unmatched.length > 0 ? 'Expliquer un autre mot…' : 'Expliquer un mot…')}
        </button>
      </div>
    );
    if (!understood && !list && !explain) {
      return null;
    }
    return (
      <div>
        {understood}
        {list}
        {explain}
      </div>
    );
  }

  render() {
    const { name, placeholder, sparkleIcon, variant, hint, size, className, t } = this.props;
    const comingSoon = this.isComingSoon();
    const pending = this.isPending();
    const kbdHint = this.props.kbdHint === null ? tr(t, 'rbf.search.natural.kbd', 'Rechercher') : this.props.kbdHint;
    const submitLabel = this.props.submitLabel || tr(t, 'rbf.search.natural.submit', 'Remplir les critères');
    const sparkleTitle = comingSoon
      ? tr(t, 'rbf.search.natural.comingSoon', 'Recherche en langage naturel : en construction pour l’instant')
      : tr(t, 'rbf.search.natural.ask', 'Interpréter la phrase');
    /* Sous le champ : la notice (4 s), l'attente (le modèle met quelques secondes sur
       un serveur sans GPU), puis ce que l'interprétation a corrigé ou ignoré. */
    const panel = this.state.panel ? this.renderPanel() : null;
    const notice = this.state.notice ? (
      <small className="rbf-natural-search-notice form-text text-warning" role="status">
        {this.state.notice}
      </small>
    ) : pending ? (
      <small className="rbf-natural-search-pending form-text text-muted" role="status">
        {tr(t, 'rbf.search.natural.pending', 'Analyse de la phrase en cours, quelques secondes…')}
      </small>
    ) : null;
    /* En ligne dans la carte ; dans la barre, flottant sous le champ pour ne pas
       pousser l'en-tête de liste. */
    const after =
      panel &&
      (variant === 'card' ? (
        <div className="rbf-natural-search-after mt-1" onKeyDown={this.onPanelKeyDown}>
          {panel}
        </div>
      ) : (
        <Dropdown myRef={this.groupRef} align="bottom-left" className="rbf-natural-search-panel" onClose={this.closePanel}>
          <div className="rbf-natural-search-after p-2" onKeyDown={this.onPanelKeyDown}>
            {panel}
          </div>
        </Dropdown>
      ));
    const sparkle = (
      <button
        type="button"
        className="btn btn-outline-rbf bg-light text-secondary rbf-natural-search-sparkle"
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
        className="border-rbf form-control"
        name={name}
        placeholder={placeholder}
        value={this.text()}
        onChange={this.onChange}
        onKeyDown={variant === 'card' ? this.onKeyDown : undefined}
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
        <div className={classnames('rbf-natural-search rbf-natural-search-card', className)}>
          <div className="border rounded p-3 bg-white">
            <div className={classnames('input-group', size && `input-group-${size}`)} ref={this.groupRef}>
              <div className="input-group-prepend">{sparkle}</div>
              {input}
              <div className="input-group-append">
                {waiting}
                <button type="button" className="btn btn-primary" disabled={pending} onClick={this.interpret}>
                  {submitLabel}
                </button>
              </div>
            </div>
            {notice}
            {after}
          </div>
          {hint && <small className="form-text text-muted mt-2">{hint}</small>}
        </div>
      );
    }
    return (
      <form className={classnames('rbf-natural-search rbf-natural-search-bar', className)} onSubmit={this.onSubmit}>
        <div className={classnames('input-group', size && `input-group-${size}`)} ref={this.groupRef}>
          <div className="input-group-prepend">{sparkle}</div>
          {input}
          {(waiting || kbdHint) && (
            <div className="input-group-append">
              {waiting || (
                <button type="submit" className="btn btn-primary rbf-natural-search-submit" disabled={pending}>
                  {kbdHint}
                </button>
              )}
            </div>
          )}
        </div>
        {notice}
        {after}
      </form>
    );
  }
}
