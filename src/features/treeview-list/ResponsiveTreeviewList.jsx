import React from 'react';
import { Responsive } from '../layout';
import { MobileTreeviewList, DefaultTreeviewList } from './';

const mystyle = {
  overflow: 'hidden',
  position: 'absolute',
  top: '0px',
  bottom: '0px',
  left: '0px',
  right: '0px',
};

export const ResponsiveTreeviewList = props => (
  <div style={mystyle}>
    <Responsive displayIn={['Mobile']}>
      <MobileTreeviewList {...props} />
    </Responsive>
    <Responsive displayIn={['Laptop', 'Tablet']}>
      <DefaultTreeviewList {...props} />
    </Responsive>
  </div>
);
