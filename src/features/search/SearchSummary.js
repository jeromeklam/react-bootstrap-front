import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { rbfIntl } from '../intl';
import { filterToSentenceParts } from './filterToSentence';
import { tr } from './i18n';

/**
 * L'encart « EN CLAIR » : la phrase d'un filtre, valeurs en gras. Variante `box`
 * (encart fond clair, titre en capitales) pour le tiroir, `inline` pour le pied de
 * la fiche de recherche. Classes Bootstrap seulement.
 */
export const SearchSummary = props => {
  const { filter, catalog, variant, title, subject, emptyText, theme, className, withDefaults, t } = props;
  const parts = filterToSentenceParts(filter, catalog, t, { subject, withDefaults });
  const content = parts ? (
    parts.map((part, i) => (part.bold ? <strong key={i}>{part.text}</strong> : <span key={i}>{part.text}</span>))
  ) : (
    <span className="text-muted">{emptyText || tr(t, 'rbf.search.summary.empty', 'Aucun critère')}</span>
  );
  if (variant === 'inline') {
    return <span className={classnames('rbf-search-summary-inline', className)}>{content}</span>;
  }
  return (
    <div className={classnames('rbf-search-summary border border-secondary-light rounded p-3', `bg-${theme}`, className)} role="status">
      <div className="small text-uppercase font-weight-bold text-secondary mb-1">
        {title || tr(t, 'rbf.search.summary.title', 'En clair')}
      </div>
      <div>{content}</div>
    </div>
  );
};

SearchSummary.propTypes = {
  filter: PropTypes.object,
  catalog: PropTypes.array,
  variant: PropTypes.oneOf(['box', 'inline']),
  title: PropTypes.string,
  subject: PropTypes.string,
  emptyText: PropTypes.string,
  theme: PropTypes.string,
  className: PropTypes.string,
  withDefaults: PropTypes.bool,
  t: PropTypes.func,
};

SearchSummary.defaultProps = {
  filter: null,
  catalog: [],
  variant: 'box',
  title: null,
  subject: null,
  emptyText: null,
  theme: 'light',
  className: '',
  withDefaults: true,
  t: rbfIntl,
};

export default SearchSummary;
