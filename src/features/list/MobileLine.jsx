import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { MobileLineCol } from './';

import { getObjectmemberValue } from '../helper';
import { Row } from '../grid';

const navstyle = {
  right: '5px',
  padding: '0px',
  float: 'right',
};

const getCardTitle = (cols, item) => {
  const pos = cols.findIndex(elem => elem.card && elem.card.role && elem.card.role === 'TITLE');
  if (pos >= 0) {
    if (typeof cols[pos].card.fDisplay === 'function') {
      return cols[pos].card.fDisplay(item);
    }
    if (typeof cols[pos].fDisplay === 'function') {
      return cols[pos].fDisplay(item);
    }
    const col = cols[pos].col;
    if (item[col]) {
      return item[col];
    }
  }
  return '';
};

export const MobileLine = props => (
  <div className={classnames('row list-mobile-line', props.className)}>
    <div className="col-xs-w36">
      <div className="card bg-secondary-light m-2">
        <div className="card-header text-secondary">
          <span className="pl-2">{getCardTitle(props.cols, props.item)}</span>
          <ul style={navstyle} className="nav nav-pills justify-content-end">
            {props.inlineActions &&
              props.inlineActions.map(action => (
                <li className="nav-item" key={action.name}>
                  <button
                    type="button"
                    disabled={action.disabled || false}
                    title={action.label || ''}
                    className={classnames('btn btn-inline', action.theme && `btn-${action.theme}`)}
                    onClick={evt => {
                      evt.stopPropagation();
                      if (action.role === 'DELETE') {
                        this.onConfirmDel();
                      } else if (action.param === 'object') {
                        action.onClick(props.item);
                      } else {
                        action.onClick(this.props.id);
                      }
                    }}
                  >
                    {action.icon}
                  </button>
                </li>
              ))}
          </ul>
        </div>
        <div className="card-body p-2">
          <Row>
            {props.cols.map((oneCol, i) => {
              if (!oneCol.hidden && oneCol.card) {
                const line = { ...oneCol, id: props.id };
                const content = getObjectmemberValue(props.item, oneCol.col);
                const first = i === 0;
                const last = i === props.cols.length - 1;
                return (
                  <MobileLineCol
                    key={`col-${oneCol.col}`}
                    first={first}
                    last={last}
                    content={content}
                    item={props.item}
                    {...line}
                  />
                );
              }
              return null;
            })}
          </Row>
        </div>
      </div>
    </div>
  </div>
);

MobileLine.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  item: PropTypes.element.isRequired,
  cols: PropTypes.element.isRequired,
  id: PropTypes.string.isRequired,
};

MobileLine.defaultProps = {
  className: '',
};
