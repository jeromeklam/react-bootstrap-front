import React from 'react';
import PropTypes from 'prop-types';
import { TreeBranch } from './';
import { SmLoading3Dots } from '../spinner';

export const DefaultTreeview = props => (
  <div className="treview">
    <ul className="list-group">
      {props.tree.isInitiated() ? (
        <TreeBranch {...props} node={props.tree.getRootNode()} paddingLeft={20} />
      ) : (
        <SmLoading3Dots />
      )}
    </ul>
  </div>
);

DefaultTreeview.propTypes = {
  tree: PropTypes.element.isRequired,
};
