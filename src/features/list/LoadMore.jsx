import React from 'react';
import PropTypes from 'prop-types';

export const LoadMore = props => (
  <div className="layout-load-more">
    <div className="row">
      <div className="col-xs-w36">
        <button onClick={props.onLoadMore} className="btn btn-md btn-primary btn-lg btn-block rounded-0">
          Plus
        </button>
      </div>
    </div>
  </div>
);

LoadMore.propTypes = {
  onLoadMore: PropTypes.func.isRequired,
};
