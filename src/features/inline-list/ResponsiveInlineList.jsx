import React from 'react';
import { Responsive } from '../layout';
import { MobileList, DefaultList } from './';

export const ResponsiveInlineList = props => (
  <div>
    <Responsive displayIn={['Mobile']}>
      <MobileList {...props} />
    </Responsive>
    <Responsive displayIn={['Laptop', 'Tablet']}>
      <DefaultList {...props} />
    </Responsive>
  </div>
);
