import React from 'react';
import PropTypes from 'prop-types';
import { rbfIntl } from '../intl';

export const LoadMore = props => (
  <div className="layout-load-more">
    <div className="row">
      <div className="col-xs-w36">
        <button onClick={props.onLoadMore} className="btn btn-md btn-primary btn-lg btn-block rounded-0">
          {props.t({ id: 'rbf.list.more', defaultMessage: 'More' })}
        </button>
      </div>
    </div>
  </div>
);

LoadMore.propTypes = {
  onLoadMore: PropTypes.func.isRequired,
  t: PropTypes.func,
};
LoadMore.defaultProps = {
  t: rbfIntl,
}
