import React from 'react';
import classnames from 'classnames';
import { SortableElement } from 'react-sortable-hoc';

const liStyle = {
  height: '50px',
  lineHeight: '50px',
  paddingTop: '0px',
  paddingBottom: '0px',
  paddingLeft: '20px',
};

const mystyle = {
  userSelect: 'none',
  fontWeight: 'bold',
  position: 'relative',
};

export const SortableItem = SortableElement(props => (
  <li className="list-group-item bg-primary-light border-primary text-secondary noselect" style={liStyle}>
    <span className="noselect" style={mystyle}>{props.value}{' '}</span>
    <div className="sort-icon float-right">
      {' '}
      <button className={classnames('btn', props.way !== 'none' ? 'text-primary' : 'text-secondary')} onClick={props.onSortChange}>
        {props.icon}
      </button>
    </div>
  </li>
));
