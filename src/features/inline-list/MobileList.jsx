import React from 'react';
import PropTypes from 'prop-types';
import { MobileLineAction, MobileLineText } from './';
import { MobileLine } from '../list';

export const MobileList = props => {
  let dispCols = props.cols;
  dispCols.forEach(col => {
    if (col.card && !col.card.position) {
      col.card.position = 99;
    }
  });
  dispCols = dispCols.filter(col => !col.hidden);
  let mobileCols = dispCols.filter(col => col.card);
  mobileCols.sort((a, b) => {
    if ((a.card.position && b.card.position && a.card.position > b.card.position) || !a.card.position) {
      return 1;
    } else {
      return -1;
    }
  });
  let counter = 1;
  return (
    <div className="text-left">
      {Array.isArray(props.items) &&
        props.items.map(item => (
          <MobileLine
            {...props}
            key={item.id}
            cols={mobileCols}
            counter={props.oddEven ? counter++ : 0}
            id={item.id}
            item={item}
            title={item[props.mainCol]}
            selectable={false}
            hideMenu={true}
            onSelect={props.onSelect}
            forSelectOne={true}
          />
        ))}
      {((!props.loading && !Array.isArray(props.items)) || props.items.length === 0) && (
        <MobileLineText
          className="text-secondary"
          label={props.t({ id: 'rbf.inlinelist.empty', defaultMessage: 'Liste vide' })}
        />
      )}
      {!props.loading &&
        Array.isArray(props.items) &&
        props.onMore &&
        props.total > props.items.length &&
        props.items.length > 0 && (
          <MobileLineAction
            className="btn btn-secondary-light text-secondary font-weight-bold"
            label={props.t({ id: 'rbf.inline-list.list.more', defaultMessage: 'Plus de résultats' })}
            onClick={ev => {
              if (ev) {
                ev.stopPropagation();
              }
              props.onMore();
            }}
          />
        )}
    </div>
  );
};

MobileList.propTypes = {
  MobileList: PropTypes.bool,
}

MobileList.defaultProps = {
  MobileList: false,
}