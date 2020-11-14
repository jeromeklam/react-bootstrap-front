import React from 'react';
import PropTypes from 'prop-types';
import { DropdownWrapper } from '../advanced';
import { DropdownMenu, DropdownMenuOption, DropdownMenuDivider } from '../basic';

const CardMenu = props => (
  <DropdownWrapper
    position="bottom"
    trigger={<button className="btn btn-sm btn-light trello-card-menu-menu">&hellip;</button>}
  >
    <DropdownMenu className="trello-card-menu">
      {props.update && (
        <DropdownMenuOption
          onClick={props.onUpdate}
          label={props.t({ id: 'rbf.trello.card.update', defaultMessage: 'Update card' })}
        />
      )}
      {props.options &&
        props.options.length > 0 &&
        props.options.map(option => (
          <DropdownMenuOption
            key={option.label}
            onClick={option.onClick}
            label={option.label}
            theme={option.theme || null}
          />
        ))}
      {props.delete && <DropdownMenuDivider />}
      {props.delete && (
        <DropdownMenuOption
          onClick={props.onDelete}
          label={props.t({ id: 'rbf.trello.card.delete', defaultMessage: 'Delete card' })}
          theme="warning"
        />
      )}
    </DropdownMenu>
  </DropdownWrapper>
);

CardMenu.propTypes = {
  delete: PropTypes.bool,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
  options: PropTypes.array,
  t: PropTypes.func.isRequired,
  update: PropTypes.bool,
};

CardMenu.defaultProps = {
  delete: true,
  onDelete: () => {},
  onUpdate: () => {},
  options: [],
  update: true,
};

export default CardMenu;
