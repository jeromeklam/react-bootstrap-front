import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
 * Groupe de boutons de la barre d'outils.
 * Les groupes marqués optionnels disparaissent sous md et sont rebasculés dans
 * le menu « … » : c'est du pur CSS Bootstrap, aucun calcul de largeur.
 */
export default function ToolbarGroup(props) {
  return (
    <div
      className={classnames('btn-group btn-group-sm rbf-editor-group', props.optional && 'd-none d-md-inline-flex')}
      role="group"
    >
      {props.children}
    </div>
  );
}

ToolbarGroup.propTypes = {
  optional: PropTypes.bool,
};

ToolbarGroup.defaultProps = {
  optional: false,
};
