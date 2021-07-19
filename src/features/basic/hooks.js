import React, { useState } from 'react';

export const useToggle = (initialValue = true) => {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue(v => !v);
  return [value, toggle];
};

