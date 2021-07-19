import React from 'react';
import { Responsive } from '../layout';
import { MobilePageHeader, DefaultPageHeader } from './';

export const ResponsivePageHeader = props => (
  <div>
    <Responsive displayIn={['Mobile']}>
      <MobilePageHeader {...props} />
    </Responsive>
    <Responsive displayIn={['Laptop', 'Tablet']}>
      <DefaultPageHeader {...props} />
    </Responsive>
  </div>
);
