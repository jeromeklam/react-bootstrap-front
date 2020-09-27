import React from 'react';
import { Responsive } from '../layout';
import { MobilePage, DefaultPage } from './';

export const ResponsivePage = props => (
  <div>
    <Responsive displayIn={['Mobile']}>
      <MobilePage {...props} />
    </Responsive>
    <Responsive displayIn={['Laptop', 'Tablet']}>
      <DefaultPage {...props} />
    </Responsive>
  </div>
);
