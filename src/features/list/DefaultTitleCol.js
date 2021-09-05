import React from 'react';
import classnames from 'classnames';

export const DefaultTitleCol = props => {
  let addClass = '';
  if (props.col.align !== '') {
    addClass = 'text-' + props.align;
  }
  switch (props.col.type) {
    case 'monetary': {
      if (props.align === '') {
        addClass = 'text-right';
      }
      break;
    }
    case 'thumbnail': {
      if (props.align === '') {
        addClass = 'text-right';
      }
      break;
    }
    default:
      break;
  }
  if (!props.col.hidden && (props.col.title === true || typeof props.col.title === 'undefined')) {
    //const first = props.idx === 0;
    //const last = props.idx === props.cols.length - 1;
    const found = props.sort && props.sort.find(element => element.col === props.col.col);
    let crt = 'none';
    let way = 'up';
    let title = props.t({ id: 'rbf.list.title.sort.none', defaultMessage: 'No sort' });
    if (found) {
      crt = found.way;
      if (found.way === 'up') {
        title = props.t({ id: 'rbf.list.title.sort.up', defaultMessage: 'Sort up' });
        way = 'down';
      } else {
        title = props.t({ id: 'rbf.list.title.sort.down', defaultMessage: 'Sort down' });
        way = 'none';
      }
    } else {
      way = 'up';
    }
    let cols = '';
    if (typeof props.col.size === 'object') {
      Object.keys(props.col.size).forEach(key => {
        if (!isNaN(props.col.size[key])) {
          cols += ` col-${key}-w${props.col.size[key]} `;
        } else {
          cols += ` col-${key}-${props.col.size[key]} `;
        }
      });
    } else {
      if (!isNaN(props.col.size)) {
        cols = `col-xxs-w${props.col.size}`;
      } else {
        cols = `col-xxs-${props.col.size}`;
      }
    }
    if (typeof props.col.first !== 'undefined') {
      if (typeof props.col.first === 'object') {
        Object.keys(props.col.first).forEach(key => {
          if (props.col.first[key]) {
            cols += ` col-${key}-first `;
          }
        });
      } else if (props.col.first) {
        cols += ' col-xxs-first ';
      }
    }
    if (typeof props.col.last !== 'undefined') {
      if (typeof props.col.last === 'object') {
        Object.keys(props.col.last).forEach(key => {
          if (props.col.last[key]) {
            cols += ` col-${key}-last `;
          }
        });
      } else if (props.col.last) {
        cols += ' col-xxs-last ';
      }
    }
    let style = {};
    if (props.col.sortable) {
      style.marginRight = '24px';
    }
    return (
      <div
        key={props.col.col}
        title={title}
        className={classnames(cols, 'col-title col-vertical-align', props.col.sortable && 'sortable', addClass, props.className)}
        onClick={() => {
          props.onSort(props.col, way);
        }}
      >
        <span style={style}>{props.col.shortLabel ? props.col.shortLabel : props.col.label}</span>
        <div className={classnames('sort-icon', crt !== 'none' ? 'text-secondary' : 'text-white')}>
          {props.col.sortable &&
            {
              down: props.sortDownIcon,
              up: props.sortUpIcon,
              none: props.sortNoneIcon,
              default: props.sortNoneIcon,
            }[crt]}
        </div>
      </div>
    );
  }
  return null;
};
