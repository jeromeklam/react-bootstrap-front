import React from 'react';
import PropTypes from 'prop-types';
import { DefaultHeader, DefaultLine } from './';

export const DefaultList = props => (
  <div className="ui-inline-list-default-list">
    <DefaultHeader {...props} />
    <div className="ui-inline-list-default-list-content">
      {Array.isArray(props.items) &&
        props.items.map(item => <DefaultLine {...props} key={item.id} id={item.id} item={item} />)}
    </div>
  </div>
);
