import React from 'react';
import { MobileList, DefaultList } from './';
import { WidthObserver } from '../advanced';
import { rbfIntl } from '../intl';

export const ResponsiveInlineList = props => (
  <WidthObserver>
    {({ mediaSize }) => {
      if (mediaSize !== 'xxs' && mediaSize !== 'xs') {
        return <DefaultList {...props} t={props.t ? props.t : rbfIntl} />;
      } else {
        return <MobileList {...props} t={props.t ? props.t : rbfIntl} />;
      }
    }}
  </WidthObserver>
);
