import React from 'react';
import PropTypes from 'prop-types';
import { rbfIntl } from '../intl';

export const MobileLoadMore = props => (
  <div className="layout-load-more">
    <div className="row">
      <div className="col-xxs-w36">
        <div className="p-2">
          <button onClick={props.onLoadMore} className="btn btn-md btn-primary btn-lg btn-block rounded">
            {props.t({ id: 'rbf.list.more', defaultMessage: 'More' })}
          </button>
        </div>
      </div>
    </div>
  </div>
);

MobileLoadMore.propTypes = {
  onLoadMore: PropTypes.func.isRequired,
  t: PropTypes.func,
};
MobileLoadMore.defaultProps = {
  t: rbfIntl,
};
