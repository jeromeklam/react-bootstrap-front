import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { SortableItem } from './';

const mystyle = {
  userSelect: 'none',
};

export const SortableList = SortableContainer((props) => {
  return (
    <ul style={mystyle} className="list-group">
      {props.items.map((value, index) => {
        if (value.label !== '') {
          let icon = props.sortNoneIcon;
          if (value.way === 'up') {
            icon = props.sortUpIcon;
          } else if (value.way === 'down') {
            icon = props.sortDownIcon;
          }
          return (
            <SortableItem
              key={`item-${index}`}
              index={index}
              value={value.label}
              icon={icon}
              onSortChange={() => {
                props.onSortChange(value);
              }}
            />
          );
        }
        return null;
      })}
    </ul>
  );
});
