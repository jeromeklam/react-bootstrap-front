import React from 'react';
import PropTypes from 'prop-types';
import { Loading3Dots } from '../spinner';
import { LoadMore, LoadError, LoadComplete } from './';

export const DefaultFooter = props => (
  <div className="default-list-footer">
    {props.loadMorePending ? (
      <div className="mt-2 text-center text-primary">{props.loader ? props.loader : <Loading3Dots />}</div>
    ) : (
      <div>
        {props.items.length > 0 && (
          <div>{props.loadMoreFinish ? <LoadComplete /> : <LoadMore onLoadMore={props.onLoadMore} />}</div>
        )}
      </div>
    )}
    {props.loadMoreError && <LoadError />}
  </div>
);

DefaultFooter.propTypes = {
  loader: PropTypes.element,
  loadMorePending: PropTypes.bool.isRequired,
  loadMoreFinish: PropTypes.bool.isRequired,
  loadMoreError: PropTypes.element,
  onLoadMore: PropTypes.func.isRequired,
  items: PropTypes.element.isRequired,
};

DefaultFooter.defaultProps = {
  loader: null,
  loadMoreError: '',
};
