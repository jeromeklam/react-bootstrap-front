import React from 'react';
import PropTypes from 'prop-types';
import { MobileLineAction, MobileLineText } from './';
import { MobileLine } from '../list';

export const MobileList = props => (
  <div>
    {Array.isArray(props.items) &&
      props.items.map(item => (
        <MobileLine
          key={item.id}
          cols={props.cols}
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
      props.total >= props.items.length &&
      props.items.length > 0 && (
        <MobileLineAction
          className="btn btn-primary text-light"
          label={props.t({ id: 'rbf.inlinelist.more', defaultMessage: 'Plus de résultats' })}
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
