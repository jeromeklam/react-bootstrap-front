import React from 'react';
import PropTypes from 'prop-types';
import { DropdownWrapper } from '../advanced';
import { DropdownMenu, DropdownMenuOption, DropdownMenuDivider } from '../basic';

const LaneMenu = props => {
  const refOptions = React.createRef();
  return (
    <>
      <DropdownWrapper
        position="bottom"
        trigger={<button className="btn btn-sm btn-light trello-lane-menu-menu">&hellip;</button>}
        tooltip="Actions à effectuer"
      >
        <DropdownMenu className="trello-lane-menu">
          {props.options &&
            props.options.length > 0 &&
            props.options.map(option => (
              <DropdownMenuOption
                key={option.label}
                onClick={() => option.onClick(props.id, refOptions)}
                label={option.label}
                theme={option.theme || null}
              />
            ))}
          {props.delete && <DropdownMenuDivider />}
          {props.delete && (
            <DropdownMenuOption
              onClick={props.onDelete}
              label={props.t({ id: 'rbf.trello.lane.delete', defaultMessage: 'Delete lane' })}
              theme="warning"
            />
          )}
        </DropdownMenu>
      </DropdownWrapper>
      <div ref={refOptions} />
    </>
  );
};

LaneMenu.propTypes = {
  id: PropTypes.string.isRequired,
  delete: PropTypes.bool,
  onDelete: PropTypes.func,
  options: PropTypes.array,
  t: PropTypes.func.isRequired,
};

LaneMenu.defaultProps = {
  delete: false,
  onDelete: () => {},
  options: [],
};

export default LaneMenu;
