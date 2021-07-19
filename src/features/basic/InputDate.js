import React from 'react';
import { InputDateWeb, InputDateNatif } from './';
import { isMobileDevice } from '../helpers';

export default function InputDate(props) {
  if (isMobileDevice()) {
    return <InputDateNatif {...props} />;
  } else {
    return <InputDateWeb {...props} />;
  }
}
