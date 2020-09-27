import React from 'react';
import PropTypes from 'prop-types';
import { TreeBranch } from './';

export const TreeNode = props => (
  <div>
    {props.tree.getChildren(props.node).map(node => (
      <TreeBranch key={node.id} {...props} node={node} />
    ))}
  </div>
);

TreeNode.propTypes = {
  tree: PropTypes.element.isRequired,
  node: PropTypes.number.isRequired,
};
