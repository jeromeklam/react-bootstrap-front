import React from 'react';
import { Responsive } from '../layout';
import { MobileHeader, DefaultHeader } from './';

export const ResponsiveHeader = props => (
  <div>
    <Responsive displayIn={['Mobile']}>
      <MobileHeader {...props} />
    </Responsive>
    <Responsive displayIn={['Laptop', 'Tablet']}>
      <DefaultHeader {...props} />
    </Responsive>
  </div>
);
