import { rbfIntl } from '../intl';

/**
 * Traduction à la façon de la bibliothèque, avec des valeurs.
 *
 * `rbfIntl` ignore le second argument ; `intl.formatMessage` l'interpole. Dans les
 * deux cas, les `{jeton}` restants sont remplacés ici, pour que les deux `t`
 * donnent le même texte.
 */
export const tr = (t, id, defaultMessage, values = {}) => {
  const fn = typeof t === 'function' ? t : rbfIntl;
  let text = fn({ id, defaultMessage }, values);
  if (typeof text !== 'string' || text === '') {
    text = defaultMessage;
  }
  return text.replace(/\{(\w+)\}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : match
  );
};

const warned = new Set();

/* Un avertissement par message : les catalogues se reconstruisent à chaque rendu. */
export const warnOnce = message => {
  if (warned.has(message)) {
    return;
  }
  warned.add(message);
  if (typeof console !== 'undefined' && console.warn) {
    console.warn('react-bootstrap-front.search : ' + message);
  }
};
