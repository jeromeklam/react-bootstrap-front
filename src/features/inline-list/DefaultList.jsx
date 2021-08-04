import React from 'react';
import PropTypes from 'prop-types';
import { DefaultHeader, DefaultLine, DefaultLineAction } from './';
import { rbfIntl } from '../intl';

export const DefaultList = props => (
  <div className="ui-inline-list-default-list">
    <DefaultHeader {...props} />
    <div className="ui-inline-list-default-list-content">
      {Array.isArray(props.items) &&
        props.items.map(item => <DefaultLine {...props} key={item.id} id={item.id} item={item} />)}
    </div>
    {!props.loading &&
      Array.isArray(props.items) &&
      props.onMore &&
      props.total >= props.items.length &&
      props.items.length > 0 && (
        <DefaultLineAction
          className="btn btn-primary text-light"
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

DefaultList.propTypes = {
  onMore: PropTypes.func,
  t: PropTypes.func,
};
DefaultList.defaultProps = {
  onMore: null,
  t: rbfIntl,
};
