import React, { useState } from 'react';

export default function CalmButton(props) {
  const [executing, setExecuting] = useState(false);

  const {
    disabled,
    onClick,
    ...otherProps
  } = props;

  const onRealClick = (event) => {
    setExecuting(true);
    onClick();
    setTimeout(() => {setExecuting(false)}, 1000);
  };

  return (
    <button
      {...otherProps}
      onClick={onRealClick}
      disabled={executing || disabled}
    >
      {props.children || ''}
    </button>
  )
}
