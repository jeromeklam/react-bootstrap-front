import React from 'react';

let WidthObserverProps = {
  height: 1024,
  position: null,
  width: 500,
};

export const WidthObserverSetWidth = (width) => {
  WidthObserverProps.width = width;
}

const WidthObserver = props => {
  return <div>{props.children(WidthObserverProps)}</div>
};

export default WidthObserver;
