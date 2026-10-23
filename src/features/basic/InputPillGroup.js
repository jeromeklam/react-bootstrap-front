import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Chip from './Chip';

/**
 * Pastilles à bascule : plusieurs choix parmi une liste (catégories, moyens de
 * paiement, programmes). Valeur : le tableau des valeurs choisies ; un tableau
 * vide veut dire « toutes » et s'affiche comme tel, toutes les pastilles pleines,
 * comme les anciennes fiches de recherche où tout était coché au départ.
 * Décocher une pastille depuis cet état ne garde que les autres ; recocher la
 * dernière manquante revient à « toutes » (tableau vide). Deux liens « Tous » et
 * « Aucun » : « Aucun » vide l'affichage pour ne cocher ensuite que quelques
 * pastilles ; validé tel quel, il vaut « toutes » lui aussi, comme avant.
 * Les options terminées (`ended`) masquées restent hors de « toutes ».
 * Émet { target: { name, value: [...] } }.
 */
export const InputPillGroup = props => {
  const {
    name, value, options, onChange, multiple, hint, checkIcon, theme, size, disabled, label, labelTop, id,
    showEndedLabel, hideEndedLabel, endedTitle, allLabel, noneLabel,
  } = props;
  const list = Array.isArray(value) ? value : [];
  const current = list.map(String);
  /* Les options terminées (`ended: true`, un moyen de paiement en fin de validité…) sont
     masquées tant qu'elles ne sont pas choisies ; un lien les affiche toutes. */
  const [showEnded, setShowEnded] = React.useState(false);
  /* « Aucun » : rien de coché à l'écran alors que la valeur est vide ; levé au premier choix
     ou dès qu'une valeur arrive de l'extérieur (une phrase, un filtre rechargé). */
  const [none, setNone] = React.useState(false);
  const currentKey = current.join('|');
  React.useEffect(() => {
    if (currentKey !== '') {
      setNone(false);
    }
  }, [currentKey]);
  const hiddenCount = options.filter(option => option.ended && !current.includes(String(option.value))).length;
  const visible = showEnded ? options : options.filter(option => !option.ended || current.includes(String(option.value)));
  const allMode = multiple && current.length === 0 && !none;
  const isActive = option => allMode || current.includes(String(option.value));
  const emit = next => onChange({ target: { name, value: next } });
  /* Un choix qui recouvre toutes les pastilles affichées vaut « toutes » : tableau vide. */
  const normalize = next => {
    if (!multiple) {
      return next;
    }
    const keys = next.map(String);
    const full = visible.length > 0 && keys.length === visible.length && visible.every(option => keys.includes(String(option.value)));
    return full ? [] : next;
  };
  const toggle = option => {
    const key = String(option.value);
    let next;
    if (allMode) {
      next = visible.filter(o => String(o.value) !== key).map(o => o.value);
    } else if (current.includes(key)) {
      next = list.filter(v => String(v) !== key);
    } else if (multiple) {
      next = [...list, option.value];
    } else {
      next = [option.value];
    }
    setNone(false);
    emit(normalize(next));
  };
  const selectAll = () => {
    setNone(false);
    emit([]);
  };
  const selectNone = () => {
    setNone(true);
    emit([]);
  };
  const showTools = multiple && visible.length > 1;
  return (
    <div className={classnames('rbf-input-pill-group form-group', !labelTop && 'row')}>
      {label && label !== '' && (
        <label htmlFor={id || name} className={classnames(!labelTop && `col-xxs-w${props.labelSize} col-form-label`)}>
          {label}
        </label>
      )}
      <div className={classnames(!labelTop && `col-xxs-w${props.inputSize}`)}>
        <div id={id || name} className="rbf-pill-group" role="group" aria-label={label || name}>
          {visible.map(option => (
            <Chip
              key={String(option.value)}
              variant="toggle"
              theme={theme}
              size={size}
              active={isActive(option)}
              label={option.label}
              count={option.count}
              checkIcon={checkIcon}
              disabled={disabled}
              onClick={() => toggle(option)}
              title={option.ended ? endedTitle : undefined}
              className={classnames('mr-1 mb-1', option.ended && 'rbf-chip-ended')}
            />
          ))}
        </div>
        {(showTools || hiddenCount > 0) && (
          <div className="rbf-pill-group-tools">
            {showTools && (
              <button type="button" className="btn btn-link btn-sm p-0 mr-2 rbf-pill-group-all" disabled={disabled || allMode} onClick={selectAll}>
                {allLabel}
              </button>
            )}
            {showTools && (
              <button type="button" className="btn btn-link btn-sm p-0 mr-2 rbf-pill-group-none" disabled={disabled || (none && current.length === 0)} onClick={selectNone}>
                {noneLabel}
              </button>
            )}
            {hiddenCount > 0 && (
              <button type="button" className="btn btn-link btn-sm p-0 rbf-pill-group-ended" onClick={() => setShowEnded(!showEnded)}>
                {showEnded ? hideEndedLabel : showEndedLabel.replace('{n}', String(hiddenCount))}
              </button>
            )}
          </div>
        )}
        {hint && hint !== '' && <small className="form-text text-muted">{hint}</small>}
      </div>
    </div>
  );
};

InputPillGroup.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.array,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  multiple: PropTypes.bool,
  hint: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  checkIcon: PropTypes.element,
  theme: PropTypes.string,
  size: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  labelTop: PropTypes.bool,
  labelSize: PropTypes.number,
  inputSize: PropTypes.number,
  id: PropTypes.string,
  showEndedLabel: PropTypes.string,
  hideEndedLabel: PropTypes.string,
  endedTitle: PropTypes.string,
  allLabel: PropTypes.string,
  noneLabel: PropTypes.string,
};

InputPillGroup.defaultProps = {
  value: [],
  multiple: true,
  hint: null,
  checkIcon: null,
  theme: 'secondary',
  size: 'sm',
  disabled: false,
  label: '',
  labelTop: true,
  labelSize: 6,
  inputSize: 30,
  id: null,
  showEndedLabel: 'Afficher aussi les {n} terminé(s)',
  hideEndedLabel: 'Masquer les terminés',
  endedTitle: 'Terminé',
  allLabel: 'Tous',
  noneLabel: 'Aucun',
};

export default InputPillGroup;
