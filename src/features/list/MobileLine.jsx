import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { getObjectmemberValue } from '../helper';
import { MobileLineCol } from './';

const navstyle = {
  position: 'absolute',
  right: '5px',
  padding: '0px',
  float: 'right',
  top: '0px',
};

export const MobileLine = props => (
  <div className="row mobile-line">
    <div className="col-xs-w36">
      <div className="card bg-secondary-light m-2">
        <div className="card-heading text-secondary">
          <span className="pl-2">{props.title}</span>
          <ul style={navstyle} className="nav justify-content-end">
            {props.inlineActions &&
              props.inlineActions.map(action => (
                <li className="nav-item" key={action.name}>
                  <a
                    title={action.label || ''}
                    className={classnames('inline-action', action.theme && `dbtn-${action.theme}`)}
                    onClick={() => {
                      if (action.role === 'DELETE') {
                        //this.onConfirmDel();
                      } else if (action.param === 'object') {
                        action.onClick(props.item);
                      } else {
                        action.onClick(props.id);
                      }
                    }}
                  >
                    <div className="icon-sm pr-2">
                      {action.icon}
                    </div>
                  </a>
                </li>
              ))}
          </ul>
        </div>
        <div className="card-body bg-light text-secondary p-2">
          <div className="row">
            {props.cols.map((oneCol, i) => {
              if (!oneCol.hidden) {
                const line = { ...oneCol, id: props.id };
                const content = getObjectmemberValue(props.item, oneCol.col);
                const first = i === 0;
                const last = i === props.cols.length - 1;
                return (
                  <MobileLineCol key={`col-${oneCol.col}`} first={first} last={last} content={content} {...line} />
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  </div>
);

MobileLine.propTypes = {
  title: PropTypes.string.isRequired,
  item: PropTypes.element.isRequired,
  cols: PropTypes.element.isRequired,
  id: PropTypes.string.isRequired,
};
