/**
 * Sérialisation du contenu de l'éditeur vers la chaîne stockée en base.
 *
 * Deux règles portent tout le fichier :
 *
 *  - un document vide rend la chaîne vide, pas `<p></p>`. Sans cela un champ
 *    `required` serait toujours considéré comme rempli et la validation des
 *    formulaires ne se déclencherait jamais ;
 *  - un paragraphe vide devient `<p>&nbsp;</p>`, parce que les clients de
 *    messagerie effondrent les paragraphes réellement vides et que la ligne
 *    blanche voulue par le rédacteur disparaîtrait à l'envoi.
 */

const DEFAULTS = {
  /** 'nbsp' (défaut), 'br' ou 'keep' */
  emptyParagraph: 'nbsp',
  /** Un document sans texte ni média rend '' */
  emptyDocumentAsEmptyString: true,
  /** Ferme les balises orphelines en XML (`<img />`) si le moteur PHP l'exige */
  selfClosing: false,
  /** Ramène les couleurs en notation hexadécimale */
  hexColors: true,
};

/**
 * Le navigateur normalise toute couleur lue dans un style en `rgb(r, g, b)`.
 * Sans cette conversion, ouvrir puis enregistrer un contenu réécrirait chaque
 * couleur de la base en `rgb()` — un changement inutile, et moins bien
 * supporté que l'hexadécimal par les clients de messagerie anciens.
 *
 * Les couleurs à transparence partielle sont laissées telles quelles :
 * l'hexadécimal sur huit chiffres n'est pas lisible par ces mêmes clients.
 */
function toHexColors(html) {
  return html.replace(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(?:1|1\.0+)\s*)?\)/gi, function(
    match,
    r,
    g,
    b,
  ) {
    const channel = value => {
      const hex = Number(value).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return '#' + channel(r) + channel(g) + channel(b);
  });
}

/** Balises qui portent du sens sans contenir de texte. */
const MEANINGFUL_EMPTY_TAGS = /<\s*(img|hr|br|iframe|video|audio)\b/i;

/**
 * Un contenu est vide s'il ne porte ni texte visible ni média.
 * Volontairement indépendante de l'éditeur : testable sans navigateur.
 */
export function isEmptyHtml(html) {
  if (html === null || html === undefined) {
    return true;
  }
  const str = String(html);
  if (str.trim() === '') {
    return true;
  }
  if (MEANINGFUL_EMPTY_TAGS.test(str)) {
    return false;
  }
  const text = str
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#160;/g, ' ')
    .replace(/\u00a0/g, ' ');
  return text.trim() === '';
}

function applyEmptyParagraph(html, mode) {
  if (mode === 'keep') {
    return html;
  }
  const filler = mode === 'br' ? '<br>' : '&nbsp;';
  /* <p></p> et <p style="…"></p>, y compris avec des blancs à l'intérieur */
  return html.replace(/<p([^>]*)>(\s|&nbsp;|&#160;)*<\/p>/gi, '<p$1>' + filler + '</p>');
}

function applySelfClosing(html) {
  return html.replace(/<(img|br|hr)\b([^>]*?)\s*\/?>/gi, function(match, tag, attrs) {
    return '<' + tag + attrs + ' />';
  });
}

/**
 * Met en forme une chaîne HTML pour le stockage.
 *
 * @param {string} html
 * @param {object} options  cf. DEFAULTS
 * @returns {string}
 */
export function serializeHtml(html, options) {
  const opts = { ...DEFAULTS, ...(options || {}) };
  if (html === null || html === undefined) {
    return '';
  }
  let out = String(html);
  if (opts.emptyDocumentAsEmptyString && isEmptyHtml(out)) {
    return '';
  }
  out = applyEmptyParagraph(out, opts.emptyParagraph);
  if (opts.hexColors) {
    out = toHexColors(out);
  }
  if (opts.selfClosing) {
    out = applySelfClosing(out);
  }
  return out;
}

/**
 * Sérialise l'état courant d'un éditeur TipTap.
 *
 * @param {object} editor  instance @tiptap/core
 * @param {object} options cf. DEFAULTS
 * @returns {string}
 */
export function serialize(editor, options) {
  if (!editor) {
    return '';
  }
  return serializeHtml(editor.getHTML(), options);
}

export default serialize;
