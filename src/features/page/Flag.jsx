import React from 'react';
import PropTypes from 'prop-types';

/**
 * Un drapeau : une image servie par l'application (`/flags/<code>.svg`), à la place de
 * react-world-flags qui embarquait les 250 drapeaux du monde en data-URI dans le bundle
 * (3,2 Mo) pour en afficher deux ou trois. Les codes à trois lettres des locales usuelles
 * sont ramenés au code à deux lettres du fichier ; `src` est le préfixe des fichiers, ou
 * une fonction code → URL.
 */
const ALPHA3 = { fra: 'fr', gbr: 'gb', deu: 'de', esp: 'es', ita: 'it', idn: 'id', che: 'ch', nld: 'nl', bel: 'be', usa: 'us', prt: 'pt', lux: 'lu' };

export const flagFile = code => {
  const c = String(code || '').toLowerCase();
  return ALPHA3[c] || c;
};

export default function Flag(props) {
  const { code, height, className, src, alt, title } = props;
  const file = flagFile(code);
  if (!file) {
    return null;
  }
  const url = typeof src === 'function' ? src(file) : `${src}${file}.svg`;
  return <img src={url} alt={alt || file} title={title} className={className} style={{ height, width: 'auto' }} loading="lazy" />;
}

Flag.propTypes = {
  code: PropTypes.string,
  height: PropTypes.number,
  className: PropTypes.string,
  src: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  alt: PropTypes.string,
  title: PropTypes.string,
};

Flag.defaultProps = {
  code: '',
  height: 24,
  className: '',
  src: '/flags/',
  alt: '',
  title: undefined,
};
