import React from 'react';
import PropTypes from 'prop-types';
import { Loading9x9 } from '../spinner';
import { MobileLoadMore, LoadError, LoadComplete } from './';

export const MobileFooter = props => (
  <div className="common-desktop-list-footer">
    {props.loadMorePending ? (
      <div className="text-primary mt-2 text-center">{props.loader ? props.loader : <Loading9x9 />}</div>
    ) : (
      <div>
        {props.loadMoreFinish ? <LoadComplete /> : <MobileLoadMore onLoadMore={props.onLoadMore} />}
      </div>
    )}
    {props.loadMoreError && <LoadError />}
  </div>
);

MobileFooter.propTypes = {
  loadMorePending: PropTypes.bool.isRequired,
  loadMoreFinish: PropTypes.bool.isRequired,
  loadMoreError: PropTypes.element,
  onLoadMore: PropTypes.func.isRequired,
};

MobileFooter.defaultProps = {
  loadMoreError: '',
};
