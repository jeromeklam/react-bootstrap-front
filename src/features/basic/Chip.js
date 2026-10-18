import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { rbfIntl } from '../intl';

/**
 * Pastille : un critère actif (avec ×), une facette (avec chevron), une bascule
 * (pleine quand elle est choisie) ou un ajout (pointillés).
 *
 * Construite sur les boutons Bootstrap : btn-outline-{theme} au repos,
 * btn-{theme} quand elle est active. Le SCSS propre (Chip.scss) se limite au
 * bouton × et aux pointillés. La référence pointe sur le bouton principal, pour
 * servir d'ancre à un Dropdown.
 */
const Chip = React.forwardRef((props, ref) => {
  const {
    label,
    variant,
    theme,
    active,
    count,
    onClick,
    onRemove,
    removeIcon,
    caretIcon,
    checkIcon,
    disabled,
    size,
    title,
    className,
    t,
  } = props;
  const filled = variant === 'toggle' && active;
  const btnTheme = filled ? `btn-${theme}` : `btn-outline-${theme}`;
  return (
    <span
      className={classnames('rbf-chip', 'btn-group', size && `btn-group-${size}`, `rbf-chip-${variant}`, className)}
      role={variant === 'toggle' ? 'presentation' : undefined}
    >
      <button
        type="button"
        ref={ref}
        className={classnames('btn', btnTheme, filled && 'active')}
        onClick={onClick}
        disabled={disabled}
        title={title}
        aria-pressed={variant === 'toggle' ? !!active : undefined}
        aria-haspopup={variant === 'facet' ? 'dialog' : undefined}
        aria-expanded={variant === 'facet' ? !!active : undefined}
      >
        {filled && checkIcon && <span className="rbf-chip-check">{checkIcon}</span>}
        {label}
        {count > 0 && <span className={classnames('badge', filled ? 'badge-light' : `badge-${theme}`, 'rbf-chip-count')}>{count}</span>}
        {variant === 'facet' && caretIcon && <span className="rbf-chip-caret">{caretIcon}</span>}
      </button>
      {onRemove && (
        <button
          type="button"
          className={classnames('btn', btnTheme, 'rbf-chip-remove')}
          onClick={onRemove}
          disabled={disabled}
          aria-label={t({ id: 'rbf.chip.remove', defaultMessage: 'Retirer' })}
          title={t({ id: 'rbf.chip.remove', defaultMessage: 'Retirer' })}
        >
          {removeIcon || '×'}
        </button>
      )}
    </span>
  );
});

Chip.propTypes = {
  label: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'active', 'facet', 'add', 'toggle']),
  theme: PropTypes.string,
  active: PropTypes.bool,
  count: PropTypes.number,
  onClick: PropTypes.func,
  onRemove: PropTypes.func,
  removeIcon: PropTypes.element,
  caretIcon: PropTypes.element,
  checkIcon: PropTypes.element,
  disabled: PropTypes.bool,
  size: PropTypes.string,
  title: PropTypes.string,
  className: PropTypes.string,
  t: PropTypes.func,
};

Chip.defaultProps = {
  variant: 'default',
  theme: 'secondary',
  active: false,
  count: 0,
  onClick: null,
  onRemove: null,
  removeIcon: null,
  caretIcon: null,
  checkIcon: null,
  disabled: false,
  size: 'sm',
  title: null,
  className: '',
  t: rbfIntl,
};

Chip.displayName = 'Chip';

export default Chip;
