import React from 'react';
import { Responsive } from '../layout';
import { MobileFooter, DefaultFooter } from './';

export const ResponsiveFooter = props => (
  <div>
    <Responsive displayIn={['Mobile']}>
      <MobileFooter {...props} />
    </Responsive>
    <Responsive displayIn={['Laptop', 'Tablet']}>
      <DefaultFooter {...props} />
    </Responsive>
  </div>
);
