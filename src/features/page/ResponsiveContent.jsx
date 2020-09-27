import React from 'react';
import { Responsive } from '../layout';
import { MobileContent, DefaultContent } from './';

export const ResponsiveContent = props => (
  <div>
    <Responsive displayIn={['Mobile']}>
      <MobileContent {...props} />
    </Responsive>
    <Responsive displayIn={['Laptop', 'Tablet']}>
      <DefaultContent {...props} />
    </Responsive>
  </div>
);
