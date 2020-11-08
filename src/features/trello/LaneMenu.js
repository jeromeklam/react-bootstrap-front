import React from 'react';
import PropTypes from 'prop-types';
import { DropdownWrapper } from '../advanced';
import { DropdownMenu, DropdownMenuHeader, DropdownMenuOption } from '../basic';

const LaneMenu = props => (
  <DropdownWrapper position="bottom" trigger={<button className="btn btn-xs trello-lane-menu-menu">⋮</button>}>
    <DropdownMenu className="trello-lane-menu">
      <DropdownMenuHeader label={props.t('Lane actions')} />
      <DropdownMenuOption onClick={props.onDelete} label={props.t('Delete lane')} theme="danger" />
    </DropdownMenu>
  </DropdownWrapper>
);

LaneMenu.propTypes = {
  onDelete: PropTypes.func,
  t: PropTypes.func.isRequired,
};

LaneMenu.defaultProps = {
  onDelete: () => {},
};

export default LaneMenu;
