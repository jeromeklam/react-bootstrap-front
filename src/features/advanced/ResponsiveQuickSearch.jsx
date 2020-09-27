import React from 'react';
import { Responsive } from '../layout';
import { MobileQuickSearch, DefaultQuickSearch } from './';

export const ResponsiveQuickSearch = props => (
  <div>
    <Responsive displayIn={['Mobile']}>
      <MobileQuickSearch {...props} />
    </Responsive>
    <Responsive displayIn={['Laptop', 'Tablet']}>
      <DefaultQuickSearch {...props} />
    </Responsive>
  </div>
);
