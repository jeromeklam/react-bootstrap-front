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
          let way = value.way;
          if (way === 'up') {
            icon = props.sortUpIcon;
          } else {
            if (way === 'down') {
              icon = props.sortDownIcon;
            } else {
              way = 'none';
            }
          } 
          return (
            <SortableItem
              key={`item-${index}`}
              index={index}
              value={value.label}
              way={way}
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
