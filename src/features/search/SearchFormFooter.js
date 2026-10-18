import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { rbfIntl } from '../intl';
import { tr } from './i18n';

/**
 * Le pied de la fiche : la phrase en clair à gauche, « Tout effacer » et le
 * bouton de recherche à droite. Collant en bas du conteneur défilant
 * (SearchForm.scss).
 */
export const SearchFormFooter = props => {
  const { summary, onClear, onSubmit, submitLabel, clearLabel, disabled, className, t } = props;
  return (
    <div className={classnames('rbf-search-form-footer d-flex align-items-center border-top bg-light px-3 py-2', className)}>
      <div className="flex-grow-1 mr-3">{summary}</div>
      <div className="text-nowrap">
        {onClear && (
          <button type="button" className="btn btn-link btn-sm" onClick={onClear} disabled={disabled}>
            {clearLabel || tr(t, 'rbf.search.form.clear', 'Tout effacer')}
          </button>
        )}
        <button type={onSubmit ? 'button' : 'submit'} className="btn btn-primary" onClick={onSubmit || undefined} disabled={disabled}>
          {submitLabel || tr(t, 'rbf.search.form.submit', 'Rechercher')}
        </button>
      </div>
    </div>
  );
};

SearchFormFooter.propTypes = {
  summary: PropTypes.node,
  onClear: PropTypes.func,
  onSubmit: PropTypes.func,
  submitLabel: PropTypes.string,
  clearLabel: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  t: PropTypes.func,
};

SearchFormFooter.defaultProps = {
  summary: null,
  onClear: null,
  onSubmit: null,
  submitLabel: null,
  clearLabel: null,
  disabled: false,
  className: '',
  t: rbfIntl,
};

export default SearchFormFooter;
