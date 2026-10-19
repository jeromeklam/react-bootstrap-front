import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Container } from '../grid';
import { Filter } from '../filter';
import { rbfIntl } from '../intl';
import { catalogToJson, orderCatalogBySections } from './catalog';
import { valuesToFilter, filterToValues } from './criteria';
import { tr } from './i18n';
import InputNaturalSearch from './InputNaturalSearch';
import SearchSummary from './SearchSummary';
import SearchFormSection from './SearchFormSection';
import SearchFormFooter from './SearchFormFooter';

/**
 * La fiche de recherche : une phrase en langage naturel (facultative), des
 * sections de champs pilotées par le catalogue, un pied avec la phrase en clair,
 * « Tout effacer » et le bouton de recherche.
 *
 * Les valeurs sont { nom: valeur } ; le Filter est recalculé à chaque rendu par
 * valuesToFilter (base conservée pour ses fixes et défauts) et remis à
 * l'application par onSubmit(filter, values). Contrôlée (`values` + `onChange`)
 * ou non (`defaultValues`).
 */
export default class SearchForm extends Component {
  static propTypes = {
    catalog: PropTypes.array.isRequired,
    sections: PropTypes.array.isRequired,
    values: PropTypes.object,
    defaultValues: PropTypes.object,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    onClear: PropTypes.func,
    base: PropTypes.object,
    mode: PropTypes.string,
    submitLabel: PropTypes.string,
    clearLabel: PropTypes.string,
    subject: PropTypes.string,
    emptyText: PropTypes.string,
    withDefaults: PropTypes.bool,
    naturalLanguage: PropTypes.object,
    advancedLink: PropTypes.object,
    icons: PropTypes.object,
    title: PropTypes.node,
    showLabels: PropTypes.bool,
    size: PropTypes.string,
    disabled: PropTypes.bool,
    locale: PropTypes.string,
    className: PropTypes.string,
    t: PropTypes.func,
  };

  static defaultProps = {
    values: null,
    defaultValues: {},
    onChange: null,
    onClear: null,
    base: null,
    mode: 'AND',
    submitLabel: null,
    clearLabel: null,
    subject: null,
    emptyText: null,
    withDefaults: true,
    naturalLanguage: null,
    advancedLink: null,
    icons: {},
    title: null,
    showLabels: false,
    size: null,
    disabled: false,
    locale: 'fr',
    className: '',
    t: rbfIntl,
  };

  constructor(props) {
    super(props);
    this.state = { values: props.defaultValues || {}, phrase: '', filled: false, warnings: [], explanation: null };
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onClear = this.onClear.bind(this);
    this.onPhraseChange = this.onPhraseChange.bind(this);
    this.onNaturalResult = this.onNaturalResult.bind(this);
  }

  values() {
    return this.props.values !== null ? this.props.values : this.state.values;
  }

  setValues(next) {
    if (this.props.values === null) {
      this.setState({ values: next });
    }
    if (this.props.onChange) {
      this.props.onChange(next);
    }
  }

  /* Le catalogue dans l'ordre des sections : la phrase du pied suit la fiche. */
  catalog() {
    return orderCatalogBySections(this.props.catalog, this.props.sections);
  }

  filter() {
    return valuesToFilter(this.values(), this.catalog(), this.props.base, { mode: this.props.mode });
  }

  onFieldChange(event) {
    const { name, value } = event.target;
    this.setValues({ ...this.values(), [name]: value });
  }

  onSubmit(event) {
    if (event) {
      event.preventDefault();
    }
    this.props.onSubmit(this.filter(), this.values());
  }

  onClear() {
    this.setValues({});
    this.setState({ filled: false, warnings: [], explanation: null });
    if (this.props.onClear) {
      this.props.onClear();
    }
  }

  onPhraseChange(event) {
    this.setState({ phrase: event.target.value });
  }

  /* Le résultat de l'interprétation remplit les champs ; rien n'est lancé. */
  onNaturalResult(result = {}) {
    const catalog = this.catalog();
    let next = null;
    if (result.values) {
      next = { ...this.values(), ...result.values };
    } else if (result.plain) {
      next = { ...this.values(), ...filterToValues(Filter.fromPlain(result.plain), catalog) };
    } else if (result.filter) {
      next = { ...this.values(), ...filterToValues(result.filter, catalog) };
    }
    if (next) {
      this.setValues(next);
    }
    const warnings = (result.warnings || []).slice();
    if (next && result.mode === 'OR') {
      warnings.push(tr(this.props.t, 'rbf.search.natural.orMode', 'Lus comme des alternatives (« ou ») ; la fiche les combine avec « et »'));
    }
    this.setState({ filled: !!next, warnings, explanation: result.explanation || null });
    if (this.props.naturalLanguage && typeof this.props.naturalLanguage.onResult === 'function') {
      this.props.naturalLanguage.onResult(result);
    }
  }

  renderNatural(filter) {
    const { naturalLanguage, icons, locale, t } = this.props;
    const catalog = this.catalog();
    if (!naturalLanguage) {
      return null;
    }
    const { filled, warnings, explanation } = this.state;
    const hint = filled ? tr(t, 'rbf.search.form.filledHint', 'Les critères ci-dessous ont été remplis depuis votre phrase. Vérifiez-les avant de lancer.') : naturalLanguage.hint;
    return (
      <div className="rbf-search-form-natural mb-3">
        <InputNaturalSearch
          variant="card"
          name="natural"
          sparkleIcon={naturalLanguage.sparkleIcon || icons.sparkle}
          placeholder={naturalLanguage.placeholder || ''}
          hint={hint || null}
          value={this.state.phrase}
          onChange={this.onPhraseChange}
          onNaturalLanguage={naturalLanguage.onNaturalLanguage || null}
          comingSoon={typeof naturalLanguage.comingSoon === 'boolean' ? naturalLanguage.comingSoon : null}
          comingSoonMessage={naturalLanguage.comingSoonMessage || null}
          onComingSoon={naturalLanguage.onComingSoon || null}
          context={{ catalog: catalogToJson(catalog), filter, locale }}
          showWarnings={false}
          onResult={this.onNaturalResult}
          onError={naturalLanguage.onError || (() => {})}
          t={t}
        />
        {warnings.length > 0 && (
          <ul className="small text-warning mt-2 mb-0 pl-3">
            {warnings.map((warning, i) => (
              <li key={i}>{warning}</li>
            ))}
          </ul>
        )}
        {explanation && <small className="form-text text-muted">{explanation}</small>}
      </div>
    );
  }

  render() {
    const { sections, submitLabel, clearLabel, subject, emptyText, withDefaults, advancedLink, icons, title, showLabels, size, disabled, className, t } = this.props;
    const catalog = this.catalog();
    const values = this.values();
    const filter = this.filter();
    return (
      <Container className={classnames('rbf-search-form', className)}>
        <form onSubmit={this.onSubmit} noValidate>
          {(title || advancedLink) && (
            <div className="d-flex align-items-center justify-content-between mb-3">
              {title ? <h4 className="text-secondary mb-0">{title}</h4> : <span />}
              {advancedLink && (
                <button type="button" className="btn btn-link btn-sm" onClick={advancedLink.onClick}>
                  {advancedLink.label || tr(t, 'rbf.search.form.advanced', 'Critères avancés')}
                </button>
              )}
            </div>
          )}
          {this.renderNatural(filter)}
          <div className="rbf-search-form-body border rounded bg-white">
            {sections.map((section, index) => (
              <SearchFormSection
                key={section.name || index}
                id={section.name ? `rbf-search-section-${section.name}` : undefined}
                first={index === 0}
                label={section.label}
                hint={section.hint}
                catalog={catalog}
                fields={section.fields}
                values={values}
                onChange={this.onFieldChange}
                icons={icons}
                showLabels={showLabels}
                size={size}
                disabled={disabled}
                t={t}
              >
                {typeof section.render === 'function'
                  ? section.render({ values, onChange: this.onFieldChange, filter, catalog, icons, t })
                  : null}
              </SearchFormSection>
            ))}
            <SearchFormFooter
              summary={<SearchSummary variant="inline" filter={filter} catalog={catalog} subject={subject} emptyText={emptyText} withDefaults={withDefaults} t={t} />}
              onClear={this.onClear}
              submitLabel={submitLabel}
              clearLabel={clearLabel}
              disabled={disabled}
              t={t}
            />
          </div>
        </form>
      </Container>
    );
  }
}
