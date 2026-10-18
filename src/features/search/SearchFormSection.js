import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Row, Col } from '../grid';
import { rbfIntl } from '../intl';
import { findField } from './catalog';
import { warnOnce } from './i18n';
import SearchFormField, { widthFor } from './SearchFormField';

/* La grille de la bibliothèque est par palier de conteneur, sans cumul : chaque
   palier reçoit sa taille. Sous sm (768 px), libellé et champs s'empilent. */
export const LABEL_SIZE = { xxs: 36, xs: 36, sm: 8, md: 6, lg: 6, xl: 5 };
export const CONTENT_SIZE = { xxs: 36, xs: 36, sm: 28, md: 30, lg: 30, xl: 31 };
export const fieldSize = width => ({ xxs: 36, xs: 36, sm: width, md: width, lg: width, xl: width });

/**
 * Une section de la fiche : le libellé en capitales à gauche, les champs à
 * droite. Soit `children` (contenu libre), soit `fields` (noms du catalogue ou
 * champs), posés dans une grille de 36 colonnes selon leur `width`.
 */
export const SearchFormSection = props => {
  const { label, hint, id, first, children, catalog, fields, values, onChange, icons, showLabels, size, disabled, className, t } = props;
  const labelId = id ? `${id}-label` : undefined;
  let content = children;
  if (!content) {
    const resolved = (fields || [])
      .map(entry => {
        const field = typeof entry === 'string' ? findField(catalog, entry) : entry;
        if (!field) {
          warnOnce(`section « ${label} » : champ « ${entry} » absent du catalogue`);
        }
        return field;
      })
      .filter(Boolean);
    /* field.newLine : le champ commence une nouvelle ligne (div.w-100 de Bootstrap). */
    const cells = [];
    resolved.forEach((field, index) => {
      if (field.newLine && index > 0) {
        cells.push(<div key={`${field.name}-break`} className="w-100" />);
      }
      cells.push(
        <Col key={field.name} size={fieldSize(widthFor(field))} className="rbf-search-form-field">
          <SearchFormField field={field} value={values[field.name]} onChange={onChange} icons={icons} showLabel={showLabels} size={size} disabled={disabled} t={t} />
        </Col>
      );
    });
    content = <Row>{cells}</Row>;
  }
  return (
    <div className={classnames('rbf-search-form-section px-3 py-3', !first && 'border-top', className)} role="group" aria-labelledby={labelId}>
      <Row>
        <Col size={LABEL_SIZE}>
          <div id={labelId} className="rbf-search-form-section-label small text-uppercase font-weight-bold text-secondary pt-2">
            {label}
          </div>
        </Col>
        <Col size={CONTENT_SIZE}>
          {content}
          {hint && <small className="form-text text-muted">{hint}</small>}
        </Col>
      </Row>
    </div>
  );
};

SearchFormSection.propTypes = {
  label: PropTypes.node.isRequired,
  hint: PropTypes.node,
  id: PropTypes.string,
  first: PropTypes.bool,
  children: PropTypes.node,
  catalog: PropTypes.array,
  fields: PropTypes.array,
  values: PropTypes.object,
  onChange: PropTypes.func,
  icons: PropTypes.object,
  showLabels: PropTypes.bool,
  size: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  t: PropTypes.func,
};

SearchFormSection.defaultProps = {
  hint: null,
  id: null,
  first: false,
  children: null,
  catalog: [],
  fields: [],
  values: {},
  onChange: () => {},
  icons: {},
  showLabels: false,
  size: null,
  disabled: false,
  className: '',
  t: rbfIntl,
};

export default SearchFormSection;
