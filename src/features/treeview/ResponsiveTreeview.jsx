import React from 'react';
import { Responsive } from '../layout';
import { MobileTreeview, DefaultTreeview } from './';

const mystyle = {
};

export const ResponsiveTreeview = props => (
  <div style={mystyle}>
    <Responsive displayIn={['Mobile']}>
      <MobileTreeview {...props} />
    </Responsive>
    <Responsive displayIn={['Laptop', 'Tablet']}>
      <DefaultTreeview {...props} />
    </Responsive>
  </div>
);
