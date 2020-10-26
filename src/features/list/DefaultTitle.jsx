import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './DefaultTitle.css';

export const DefaultTitle = props => (
  <div style={props.style} className={classnames('default-list-title row bg-secondary-light text-secondary', props.className)}>
    {props.cols.map((oneCol, i) => {
      let addClass = '';
      if (oneCol.align !== '') {
        addClass = 'text-' + props.align;
      }
      switch (oneCol.type) {
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
      if (!oneCol.hidden && (oneCol.label !== '' && (oneCol.title === true || typeof oneCol.title === 'undefined'))) {
        const first = i === 0;
        const last = i === props.cols.length - 1;
        const found = props.sort && props.sort.find(element => element.col === oneCol.col);
        let crt = 'none';
        let way = 'up';
        let title = 'Aucun tri';
        if (found) {
          crt = found.way;
          if (found.way === 'up') {
            title = 'Tri croissant';
            way = 'down';
          } else {
            title = 'Tri décroissant';
            way = 'none';
          }
        } else {
          way = 'up';
        }
        let cols = '';
        if (typeof oneCol.size === 'object') {
          Object.keys(oneCol.size).forEach((key) => {
            if (!isNaN(oneCol.size[key])) {
              cols += ` col-${key}-w${oneCol.size[key]} `;
            } else {
              cols += ` col-${key}-${oneCol.size[key]} `;
            }
          });
        } else {
          if (!isNaN(oneCol.size)) {
            cols = `col-xs-w${oneCol.size}`;
          } else {
            cols = `col-xs-${oneCol.size}`;
          }
        }
        if (typeof oneCol.first !== 'undefined') {
          if (typeof oneCol.first === 'object') {
            Object.keys(oneCol.first).forEach((key) => {
              if (oneCol.first[key]) {
                cols += ` col-${key}-first `;
              }
            });
          } else if (oneCol.first) {
            cols += ' col-xs-first ';
          }
        }
        if (typeof oneCol.last !== 'undefined') {
          if (typeof oneCol.last === 'object') {
            Object.keys(oneCol.last).forEach((key) => {
              if (oneCol.last[key]) {
                cols += ` col-${key}-last `;
              }
            });
          } else if (oneCol.last) {
            cols += ' col-xs-last ';
          }
        }
        return (
          <div
            key={oneCol.name}
            title={title}
            className={classnames(
              cols,
              'col-vertical-align',
              oneCol.sortable && 'sortable',
              addClass,
              props.className,
            )}
            onClick={() => {
              props.onSort(oneCol, way);
            }}
          >
            <span style={oneCol.selectable && { marginLeft: '20px' }}>
              {oneCol.label}
              <div className={classnames('sort-icon', crt !== 'none' ? 'text-primary' : 'text-secondary')}>
                {oneCol.sortable &&
                  {
                    down: props.sortDownIcon,
                    up: props.sortUpIcon,
                    none: props.sortNoneIcon,
                    default: props.sortNoneIcon,
                  }[crt]}
              </div>
            </span>
          </div>
        );
      }
      return null;
    })}
  </div>
);

DefaultTitle.propTypes = {
  cols: PropTypes.element.isRequired,
  sort: PropTypes.element.isRequired,
  onSort: PropTypes.func.isRequired,
  sortDownIcon: PropTypes.element.isRequired,
  sortUpIcon: PropTypes.element.isRequired,
  sortNoneIcon: PropTypes.element.isRequired,
};
