import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { rbfIntl } from '../intl';
import { SmLoading3Dots } from '../spinner';
import { tr } from './i18n';
import SearchSummary from './SearchSummary';

/**
 * Expliquer un mot au modèle : le mot (ou l'expression), ce qu'il veut dire —
 * rédigé comme une recherche sur un champ —, « Essayer » qui montre en clair ce
 * que le modèle en a compris, puis « Enregistrer ». L'application fournit
 * `onTry(term, meaning)` (interpréter l'explication) et `onSave(entry)` (la ranger,
 * partagée par l'association) ; `entry` = { term, meaning, criteria, mode }.
 */
export default class NaturalVocabularyForm extends Component {
  static propTypes = {
    term: PropTypes.string,
    phrase: PropTypes.string,
    onTry: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    catalog: PropTypes.array,
    subject: PropTypes.string,
    maxLength: PropTypes.number,
    size: PropTypes.string,
    className: PropTypes.string,
    t: PropTypes.func,
  };

  static defaultProps = {
    term: '',
    phrase: '',
    onCancel: null,
    catalog: [],
    subject: null,
    maxLength: 250,
    size: 'sm',
    className: '',
    t: rbfIntl,
  };

  constructor(props) {
    super(props);
    this.state = { term: props.term || '', meaning: '', trying: false, tried: null, saving: false, error: null };
    this.onTermChange = this.onTermChange.bind(this);
    this.onMeaningChange = this.onMeaningChange.bind(this);
    this.onTry = this.onTry.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  canTry() {
    return this.state.term.trim() !== '' && this.state.meaning.trim() !== '' && !this.state.trying && !this.state.saving;
  }

  canSave() {
    const { tried } = this.state;
    return !!tried && Array.isArray(tried.criteria) && tried.criteria.length > 0 && !this.state.trying && !this.state.saving;
  }

  onTermChange(event) {
    this.setState({ term: event.target.value, tried: null });
  }

  onMeaningChange(event) {
    this.setState({ meaning: event.target.value.slice(0, this.props.maxLength), tried: null, error: null });
  }

  /* Entrée dans le champ du mot : essayer. Pas de <form> : la fiche vit dans le
     formulaire de la fiche de recherche ou dans le panneau de la barre. */
  onSubmit(event) {
    if (event && event.key && event.key !== 'Enter') {
      return;
    }
    if (event) {
      event.preventDefault();
      if (typeof event.stopPropagation === 'function') {
        event.stopPropagation();
      }
    }
    if (this.canTry()) {
      this.onTry();
    }
  }

  onTry() {
    const { t } = this.props;
    const term = this.state.term.trim();
    const meaning = this.state.meaning.trim();
    this.setState({ trying: true, error: null });
    Promise.resolve()
      .then(() => this.props.onTry(term, meaning))
      .then(result => {
        if (!this.unmounted) {
          this.setState({ trying: false, tried: result || { criteria: [] } });
        }
      })
      .catch(() => {
        if (!this.unmounted) {
          this.setState({ trying: false, error: tr(t, 'rbf.search.natural.error', 'L’interprétation de la phrase a échoué') });
        }
      });
  }

  onSave() {
    const { t } = this.props;
    const { tried } = this.state;
    const entry = {
      term: this.state.term.trim(),
      meaning: this.state.meaning.trim(),
      mode: tried.mode,
      criteria: tried.criteria.map(c => ({ name: c.name, operator: c.operator, values: c.values })),
    };
    this.setState({ saving: true, error: null });
    Promise.resolve()
      .then(() => this.props.onSave(entry))
      .then(() => {
        if (!this.unmounted) {
          this.setState({ saving: false });
        }
      })
      .catch(() => {
        if (!this.unmounted) {
          this.setState({ saving: false, error: tr(t, 'rbf.search.vocabulary.error', 'L’enregistrement a échoué') });
        }
      });
  }

  render() {
    const { catalog, subject, maxLength, size, className, onCancel, t } = this.props;
    const { term, meaning, trying, tried, saving, error } = this.state;
    const btn = classnames('btn', size && `btn-${size}`);
    const control = classnames('form-control', size && `form-control-${size}`);
    return (
      <div className={classnames('rbf-vocabulary-form', className)}>
        <div className="font-weight-bold mb-2">
          {term.trim() ? tr(t, 'rbf.search.vocabulary.title', 'Expliquer « {term} »', { term: term.trim() }) : tr(t, 'rbf.search.vocabulary.explainWord', 'Expliquer un mot…')}
        </div>
        <div className="form-group mb-2">
          <label className="small text-muted mb-1">{tr(t, 'rbf.search.vocabulary.term', 'Le mot ou l’expression')}</label>
          <input type="text" className={control} value={term} onChange={this.onTermChange} onKeyDown={this.onSubmit} autoComplete="off" />
        </div>
        <div className="form-group mb-2">
          <label className="small text-muted mb-1">{tr(t, 'rbf.search.vocabulary.meaning', 'Ce que ça veut dire, écrit comme une recherche sur un champ')}</label>
          <textarea
            className={control}
            rows={2}
            value={meaning}
            maxLength={maxLength}
            placeholder={tr(t, 'rbf.search.vocabulary.placeholder', 'Par exemple : code postal commence par 77, 78, 91, 92, 93, 94 ou 95')}
            onChange={this.onMeaningChange}
          />
          <small className="form-text text-muted text-right">{tr(t, 'rbf.search.vocabulary.counter', '{n} / {max}', { n: meaning.length, max: maxLength })}</small>
        </div>
        {tried && (
          <div className="rbf-vocabulary-tried mb-2">
            {tried.criteria && tried.criteria.length > 0 ? (
              <SearchSummary variant="inline" filter={tried.filter} catalog={catalog} subject={subject} withDefaults={false} t={t} />
            ) : (
              <small className="text-warning">{tr(t, 'rbf.search.vocabulary.nothing', 'Rien de compris dans cette explication : écrivez-la comme une recherche sur un champ.')}</small>
            )}
            {tried.warnings && tried.warnings.length > 0 && (
              <ul className="small text-warning mt-1 mb-0 pl-3">
                {tried.warnings.map((warning, i) => (
                  <li key={i}>{warning}</li>
                ))}
              </ul>
            )}
          </div>
        )}
        {error && (
          <small className="form-text text-danger mb-2" role="alert">
            {error}
          </small>
        )}
        <div className="d-flex align-items-center">
          <button type="button" className={classnames(btn, 'btn-outline-secondary mr-2')} disabled={!this.canTry()} onClick={this.onTry}>
            {tr(t, 'rbf.search.vocabulary.try', 'Essayer')}
          </button>
          <button type="button" className={classnames(btn, 'btn-primary mr-2')} disabled={!this.canSave()} onClick={this.onSave}>
            {tr(t, 'rbf.search.vocabulary.save', 'Enregistrer')}
          </button>
          {onCancel && (
            <button type="button" className={classnames(btn, 'btn-link')} onClick={onCancel}>
              {tr(t, 'rbf.search.vocabulary.cancel', 'Annuler')}
            </button>
          )}
          {(trying || saving) && (
            <span className="ml-2">
              <SmLoading3Dots />
            </span>
          )}
        </div>
      </div>
    );
  }
}
