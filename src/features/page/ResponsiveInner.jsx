import React from 'react';
import { Responsive } from '../layout';
import { MobileInner, DefaultInner } from './';

export const ResponsiveInner = props => (
  <div>
    <Responsive displayIn={['Mobile']}>
      <MobileInner {...props} />
    </Responsive>
    <Responsive displayIn={['Laptop', 'Tablet']}>
      <DefaultInner {...props} />
    </Responsive>
  </div>
);
