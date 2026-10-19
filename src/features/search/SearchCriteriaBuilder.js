import React from 'react';
import PropTypes from 'prop-types';
import { Chip, InputSegmented } from '../basic';
import { FILTER_MODE_AND, FILTER_MODE_OR } from '../filter';
import { rbfIntl } from '../intl';
import { fieldsForRows } from './catalog';
import { newCriterionId } from './criteria';
import { tr } from './i18n';
import SearchCriteriaRow from './SearchCriteriaRow';

/**
 * Le constructeur de critères : « Afficher les donateurs qui remplissent [tous
 * les critères | au moins un] », une ligne par critère, « + Ajouter un critère ».
 * Sans état : les lignes et le mode appartiennent au parent (SearchDrawer).
 */
export const SearchCriteriaBuilder = props => {
  const { catalog, rows, mode, onRowsChange, onModeChange, modeToggle, subject, maxRows, icons, size, disabled, t } = props;
  const usedNames = rows.map(r => r.name).filter(Boolean);
  const available = fieldsForRows(catalog).filter(f => !usedNames.includes(f.name));
  const canAdd = !disabled && available.length > 0 && (!maxRows || rows.length < maxRows);
  const change = row => onRowsChange(rows.map(r => (r.id === row.id ? row : r)));
  const remove = id => onRowsChange(rows.filter(r => r.id !== id));
  const add = () => onRowsChange([...rows, { id: newCriterionId(), name: '', operator: '', values: [] }]);
  return (
    <div className="rbf-criteria-builder">
      {modeToggle && (
        <div className="d-flex flex-wrap align-items-center mb-3">
          <span className="mr-2">{tr(t, 'rbf.search.drawer.intro', 'Afficher {subject} qui remplissent', { subject: subject || tr(t, 'rbf.search.drawer.subject', 'les résultats') })}</span>
          <InputSegmented
            name="rbf-criteria-mode"
            value={mode}
            size={size || 'sm'}
            disabled={disabled}
            options={[
              { value: FILTER_MODE_AND, label: tr(t, 'rbf.search.drawer.modeAll', 'tous les critères') },
              { value: FILTER_MODE_OR, label: tr(t, 'rbf.search.drawer.modeAny', 'au moins un') },
            ]}
            onChange={ev => onModeChange(ev.target.value)}
          />
        </div>
      )}
      {rows.map(row => (
        <SearchCriteriaRow key={row.id} catalog={catalog} criterion={row} usedNames={usedNames} onChange={change} onRemove={remove} icons={icons} size={size} disabled={disabled} t={t} />
      ))}
      {rows.length === 0 && <p className="text-muted small">{tr(t, 'rbf.search.drawer.empty', 'Aucun critère : tous les résultats.')}</p>}
      <Chip
        variant="add"
        className="rbf-criteria-add"
        disabled={!canAdd}
        label={
          <span>
            {icons.add}
            {icons.add ? ' ' : '+ '}
            {tr(t, 'rbf.search.drawer.add', 'Ajouter un critère')}
          </span>
        }
        onClick={add}
        t={t}
      />
    </div>
  );
};

SearchCriteriaBuilder.propTypes = {
  catalog: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  mode: PropTypes.string,
  onRowsChange: PropTypes.func.isRequired,
  onModeChange: PropTypes.func,
  modeToggle: PropTypes.bool,
  subject: PropTypes.string,
  maxRows: PropTypes.number,
  icons: PropTypes.object,
  size: PropTypes.string,
  disabled: PropTypes.bool,
  t: PropTypes.func,
};

SearchCriteriaBuilder.defaultProps = {
  mode: FILTER_MODE_AND,
  onModeChange: () => {},
  modeToggle: true,
  subject: null,
  maxRows: null,
  icons: {},
  size: 'sm',
  disabled: false,
  t: rbfIntl,
};

export default SearchCriteriaBuilder;
