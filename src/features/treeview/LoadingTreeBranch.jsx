import React from 'react';
import { SmLoading3Dots } from '../spinner';

const itemStyle = {
  border: '0px',
  borderRadius: '0',
};

export const LoadingTreeBranch = props => (
  <div style={{ paddingLeft: `${props.paddingLeft}px` }}>
    <li className="list-group-item text-center" style={itemStyle}>
      <SmLoading3Dots className="bg-primary-light" />
    </li>
  </div>
);
