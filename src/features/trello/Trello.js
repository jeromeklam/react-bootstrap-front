import React from 'react';
import PropTypes from 'prop-types';

import Board from './Board';
import locales from './locales';
import createTranslate from '../helpers/createTranslate';

export default function Trello(props) {
  const { lang, ...otherProps } = props;
  const translate = createTranslate(locales[lang].translation);
  return <Board t={translate} {...otherProps} />;
}

Trello.propTypes = {
  lang: PropTypes.string,
};

Trello.derfaultProps = {
  lang: 'fr',
};
