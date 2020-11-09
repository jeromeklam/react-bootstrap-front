import React from 'react';
import PropTypes from 'prop-types';
import { DropdownWrapper } from '../advanced';
import { DropdownMenu, DropdownMenuHeader, DropdownMenuOption } from '../basic';

const CardMenu = props => (
  <DropdownWrapper position="bottom" trigger={<button className="btn btn-sm btn-light trello-card-menu-menu">&hellip;</button>}>
    <DropdownMenu className="trello-card-menu">
      <DropdownMenuHeader label={props.t('Card actions')} />
      {props.update && <DropdownMenuOption onClick={props.onUpdate} label={props.t('Update card')} />}
      {props.delete && <DropdownMenuOption onClick={props.onDelete} label={props.t('Delete card')} theme="warning" />}
    </DropdownMenu>
  </DropdownWrapper>
);

CardMenu.propTypes = {
  delete: PropTypes.bool,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
  t: PropTypes.func.isRequired,
  update: PropTypes.bool,
};

CardMenu.defaultProps = {
  delete: true,
  onDelete: () => {},
  onUpdate: () => {},
  update: true,
};

export default CardMenu;
