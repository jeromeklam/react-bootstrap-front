import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
 * Bouton de la barre d'outils.
 *
 * Deux détails sans lesquels la barre ne fonctionne pas dans un formulaire :
 *
 *  - `type="button"` : sans lui, le bouton soumet le formulaire qui l'entoure ;
 *  - `onMouseDown` avec `preventDefault` : sans lui, le clic vole le focus à
 *    l'éditeur, la sélection est perdue et la commande s'applique ailleurs.
 *
 * Le composant est un `forwardRef` parce que `DropdownWrapper` clone son
 * déclencheur en lui posant une ref.
 */
const ToolbarButton = React.forwardRef((props, ref) => {
  const { icon, title, active, disabled, onClick, size, className, ...rest } = props;
  return (
    <button
      {...rest}
      ref={ref}
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active ? 'true' : 'false'}
      disabled={disabled}
      className={classnames('btn btn-light rbf-editor-button', size === 'sm' && 'btn-sm', active && 'active', className)}
      onMouseDown={ev => ev.preventDefault()}
      onClick={onClick}
    >
      {icon}
    </button>
  );
});

ToolbarButton.displayName = 'ToolbarButton';

ToolbarButton.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  size: PropTypes.string,
  className: PropTypes.string,
};

ToolbarButton.defaultProps = {
  icon: null,
  title: '',
  active: false,
  disabled: false,
  onClick: () => {},
  size: 'sm',
  className: '',
};

export default ToolbarButton;
