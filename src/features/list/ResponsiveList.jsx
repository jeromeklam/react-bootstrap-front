import React from 'react';
import { Responsive } from '../layout';
import { MobileList, DefaultList } from './';

const mystyle = {
  overflow: 'hidden',
  position: 'absolute',
  top: '0px',
  bottom: '0px',
  left: '0px',
  right: '0px',
};

export const ResponsiveList = props => (
  <div style={mystyle}>
    <Responsive displayIn={['Mobile']}>
      <MobileList {...props} />
    </Responsive>
    <Responsive displayIn={['Laptop', 'Tablet']}>
      <DefaultList {...props} />
    </Responsive>
  </div>
);
