import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import DropdownWrapper from '../advanced/DropdownWrapper';
import DropdownMenu from '../basic/DropdownMenu';
import ToolbarButton from './ToolbarButton';

/**
 * Menu déroulant de la barre d'outils.
 * S'appuie sur les briques déjà présentes dans la librairie (portail,
 * fermeture automatique, positionnement) : rien de nouveau à écrire.
 */
export default function ToolbarDropdown(props) {
  const { icon, title, active, size, align, autoClose, className, children } = props;
  return (
    <DropdownWrapper
      align={align}
      autoClose={autoClose}
      tooltip={title}
      trigger={<ToolbarButton icon={icon} title={title} active={active} size={size} />}
    >
      <DropdownMenu className={classnames('rbf-editor-dropdown', className)}>{children}</DropdownMenu>
    </DropdownWrapper>
  );
}

ToolbarDropdown.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
  active: PropTypes.bool,
  size: PropTypes.string,
  align: PropTypes.string,
  autoClose: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.element.isRequired,
};

ToolbarDropdown.defaultProps = {
  icon: null,
  title: '',
  active: false,
  size: 'sm',
  align: 'bottom-left',
  autoClose: true,
  className: '',
};
