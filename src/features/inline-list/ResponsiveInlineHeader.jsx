import React from 'react';
import { DefaultHeader } from './';
import { WidthObserver } from '../advanced';
import { rbfIntl } from '../intl';

export const ResponsiveInlineHeader = props => (
  <WidthObserver>
    {({ mediaSize }) => {
      if (mediaSize !== 'xxs' && mediaSize !== 'xs') {
        return <DefaultHeader {...props} t={props.t ? props.t : rbfIntl} />;
      } else {
        return null;
      }
    }}
  </WidthObserver>
);
