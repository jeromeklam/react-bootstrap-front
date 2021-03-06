import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { DropdownWrapper } from '../advanced';
import { DropdownMenu, DropdownMenuOption, DropdownMenuDivider } from '../basic';

const CardMenu = props => {
  const refOptions = useRef();
  return (
    <>
      <DropdownWrapper
        position="bottom"
        trigger={<button className="btn btn-sm btn-light trello-card-menu-menu">&hellip;</button>}
        tooltip="Actions à effectuer sur la carte"
        myRef={refOptions}
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
            props.options.map(
              option =>
                !option.hidden && (
                  <DropdownMenuOption
                    key={option.label}
                    onClick={() => option.onClick(props.cardId, props.laneId, props.featId, refOptions)}
                    label={option.label}
                    theme={option.theme || null}
                  />
                )
            )}
          {(props.delete || props.remove) && <DropdownMenuDivider />}
          {props.remove && (
            <DropdownMenuOption
              onClick={props.onRemove}
              label={props.t({ id: 'rbf.trello.card.remove', defaultMessage: 'Remove card' })}
              theme="warning"
            />
          )}
          {props.delete && (
            <DropdownMenuOption
              onClick={props.onDelete}
              label={props.t({ id: 'rbf.trello.card.delete', defaultMessage: 'Delete card' })}
              theme="warning"
            />
          )}
        </DropdownMenu>
      </DropdownWrapper>
    </>
  );
};

CardMenu.propTypes = {
  remove: PropTypes.bool,
  delete: PropTypes.bool,
  onRemove: PropTypes.func,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
  options: PropTypes.array,
  t: PropTypes.func.isRequired,
  update: PropTypes.bool,
  laneId: PropTypes.number,
  cardId: PropTypes.number,
  featId: PropTypes.number,
};

CardMenu.defaultProps = {
  remove: true,
  delete: true,
  onRemove: () => {},
  onDelete: () => {},
  onUpdate: () => {},
  options: [],
  update: true,
  laneId: 0,
  cardId: 0,
  featId: 0,
};

export default CardMenu;
