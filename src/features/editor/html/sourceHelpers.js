/**
 * Aides de la vue source.
 *
 * Toutes pures et sans dépendance à l'éditeur : elles servent à répondre à
 * deux questions au retour vers le mode riche, et il vaut mieux pouvoir les
 * tester séparément.
 *
 *  1. le HTML saisi était-il équilibré, ou le navigateur l'a-t-il recousu ?
 *  2. le passage par le schéma de l'éditeur a-t-il perdu du contenu ?
 */

const BLOCK_TAGS = 'p|div|h[1-6]|ul|ol|li|blockquote|hr|table|thead|tbody|tr|td|th|pre|br|img';

/**
 * Indentation naïve : un bloc par ligne. Uniquement pour la lecture — ce n'est
 * jamais ce qui est réémis vers le formulaire.
 */
export function formatHtml(html) {
  if (!html) {
    return '';
  }
  const openRe = new RegExp('<(' + BLOCK_TAGS + ')\\b', 'gi');
  const closeRe = new RegExp('</(' + BLOCK_TAGS + ')\\s*>', 'gi');
  return String(html)
    .replace(openRe, match => '\n' + match)
    .replace(closeRe, match => match + '\n')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '')
    .join('\n');
}

/**
 * Suite des balises rencontrées, ouvrantes et fermantes.
 * Comparer la signature d'une saisie et celle de sa relecture par le
 * navigateur dit si le HTML était équilibré.
 */
export function tagSignature(html) {
  const tags = [];
  const re = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  let match = re.exec(String(html || ''));
  while (match !== null) {
    tags.push((match[0].charAt(1) === '/' ? '/' : '') + match[1].toLowerCase());
    match = re.exec(String(html || ''));
  }
  return tags.join(',');
}

/**
 * Texte visible, blancs normalisés. Une différence signale une perte réelle
 * de contenu, pas une simple différence de balisage.
 */
export function textSignature(html) {
  return String(html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#160;/g, ' ')
    .replace(/\u00a0/g, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Relit un fragment par le navigateur et rend le HTML recousu.
 * `DOMParser` ne lève jamais sur du HTML mal formé, il le répare — c'est
 * précisément ce qui permet de détecter le déséquilibre par comparaison.
 */
export function reserialize(html) {
  if (typeof DOMParser === 'undefined') {
    return String(html || '');
  }
  const doc = new DOMParser().parseFromString('<div id="rbf-source-root">' + html + '</div>', 'text/html');
  const root = doc.getElementById('rbf-source-root');
  return root ? root.innerHTML : String(html || '');
}

/**
 * Vrai si le HTML saisi est équilibré, c'est-à-dire si le navigateur n'a rien
 * eu à recoudre.
 */
export function isBalanced(html) {
  return tagSignature(html) === tagSignature(reserialize(html));
}
