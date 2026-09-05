/**
 * Profils et listes blanches du nettoyeur HTML.
 *
 * Trois profils, du plus doux au plus agressif :
 *
 *  - LOAD   : à l'ouverture d'un contenu existant. Supprime uniquement le bruit
 *             indiscutable (scripts, styles, balises Office). Ne retire JAMAIS
 *             de mise en forme : on ne modifie pas la base sans demande.
 *  - PASTE  : à chaque collage. Supprime tout le bruit Word / Google Docs /
 *             Outlook, mais conserve les couleurs, polices et tailles voulues.
 *  - STRICT : le bouton « Nettoyer ». PASTE + suppression des couleurs,
 *             polices, tailles, interlignes et espacements.
 */

/**
 * Balises supprimées avec leur contenu.
 */
export const DROP_TAGS = [
  'script',
  'style',
  'link',
  'meta',
  'base',
  'title',
  'head',
  'noscript',
  'iframe',
  'frame',
  'frameset',
  'object',
  'embed',
  'applet',
  'param',
  'form',
  'input',
  'button',
  'select',
  'option',
  'optgroup',
  'textarea',
  'audio',
  'video',
  'source',
  'track',
  'canvas',
  'svg',
  'math',
  'template',
  'xml',
];

/**
 * Balises conservées. Tout ce qui n'est ni ici ni dans DROP_TAGS est déballé
 * (l'élément disparaît, ses enfants sont remontés) : le texte n'est jamais perdu.
 *
 * Le jeu correspond à ce que tolère un client de messagerie ancien. Les tableaux
 * en sont volontairement absents : le schéma de l'éditeur ne les gère pas plus
 * que l'ancien, les déballer préserve au moins le texte.
 */
export const ALLOWED_TAGS = [
  'p',
  'br',
  'hr',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'strong',
  'em',
  'u',
  's',
  'sub',
  'sup',
  'span',
  'a',
  'ul',
  'ol',
  'li',
  'blockquote',
  'img',
];

/**
 * Balises historiques remplacées par leur équivalent moderne.
 */
export const TAG_ALIASES = {
  b: 'strong',
  i: 'em',
  strike: 's',
  del: 's',
  ins: 'u',
  cite: 'em',
  big: 'span',
  small: 'span',
};

/**
 * Balises vides conservées : elles portent du sens sans contenir de texte.
 */
export const KEEP_EMPTY_TAGS = ['br', 'img', 'hr', 'td', 'th'];

/**
 * Attributs conservés, par balise. La clé '*' s'applique à toutes.
 */
export const ALLOWED_ATTRIBUTES = {
  '*': ['style'],
  a: ['href', 'title', 'target', 'rel', 'name'],
  img: ['src', 'alt', 'title', 'width', 'height'],
  ol: ['start', 'type'],
  li: ['value'],
};

/**
 * Schémas d'URL autorisés. Un href hors liste perd son attribut, un src hors
 * liste fait disparaître l'élément (on ne garde pas une image inerte).
 */
export const ALLOWED_HREF_SCHEMES = ['http:', 'https:', 'mailto:', 'tel:', 'ftp:'];
export const ALLOWED_SRC_SCHEMES = ['http:', 'https:'];

/**
 * Propriétés CSS conservées. Tout le reste saute, `mso-*` compris.
 */
export const ALLOWED_STYLES = [
  'color',
  'background-color',
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'text-decoration',
  'text-decoration-line',
  'text-align',
  'vertical-align',
];

/**
 * Propriétés supprimées en plus par le profil STRICT : c'est exactement ce que
 * l'utilisateur veut faire sauter d'un clic.
 */
export const STRICT_DROP_STYLES = [
  'color',
  'background-color',
  'font-family',
  'font-size',
  'line-height',
  'letter-spacing',
  'word-spacing',
  'text-transform',
];

/**
 * Valeurs neutres : présentes, elles n'apportent rien et alourdissent le HTML.
 * Comparaison faite sur la valeur normalisée (minuscules, espaces compactés).
 */
export const NEUTRAL_STYLE_VALUES = {
  color: ['inherit', 'initial', 'unset', 'currentcolor', 'windowtext', 'black', '#000', '#000000', 'rgb(0,0,0)'],
  'background-color': [
    'inherit',
    'initial',
    'unset',
    'transparent',
    'none',
    'white',
    '#fff',
    '#ffffff',
    'rgb(255,255,255)',
  ],
  'font-weight': ['normal', '400', 'inherit', 'initial', 'unset'],
  'font-style': ['normal', 'inherit', 'initial', 'unset'],
  'text-decoration': ['none', 'inherit', 'initial', 'unset'],
  'text-decoration-line': ['none', 'inherit', 'initial', 'unset'],
  'text-align': ['inherit', 'initial', 'unset', 'start'],
  'vertical-align': ['baseline', 'inherit', 'initial', 'unset'],
  'font-family': ['inherit', 'initial', 'unset'],
  'font-size': ['inherit', 'initial', 'unset', 'medium'],
};

/**
 * Tailles de police par défaut des traitements de texte : les retirer évite de
 * figer tout un contenu collé sur la taille de Word plutôt que celle du gabarit.
 */
export const DEFAULT_FONT_SIZES = ['11pt', '12pt', '10pt', '1rem', '1em', '16px', '14.6667px', '14.667px'];

/**
 * Polices par défaut des traitements de texte, normalisées (guillemets retirés,
 * minuscules, espaces compactés).
 */
export const DEFAULT_FONT_FAMILIES = [
  'calibri,sans-serif',
  'calibri',
  'times new roman,serif',
  'times new roman',
  'aptos,sans-serif',
  'aptos',
  'arial,sans-serif',
  'arial,helvetica,sans-serif',
  'docs-calibri',
];

const BASE_OPTIONS = {
  dropTags: DROP_TAGS,
  allowedTags: ALLOWED_TAGS,
  tagAliases: TAG_ALIASES,
  keepEmptyTags: KEEP_EMPTY_TAGS,
  allowedAttributes: ALLOWED_ATTRIBUTES,
  allowedHrefSchemes: ALLOWED_HREF_SCHEMES,
  allowedSrcSchemes: ALLOWED_SRC_SCHEMES,
  allowDataImages: true,
  allowedStyles: ALLOWED_STYLES,
  dropStyles: [],
  neutralStyleValues: NEUTRAL_STYLE_VALUES,
  defaultFontSizes: DEFAULT_FONT_SIZES,
  defaultFontFamilies: DEFAULT_FONT_FAMILIES,
  /** Classes conservées. Vide par défaut : c'est ce qui fait sauter les MsoNormal. */
  keepClasses: [],
  /** Remplace les <div> par des <p> lorsque le contexte le permet. */
  convertDivToP: true,
  /** Déballe les <span> qui ne portent plus aucun attribut. */
  unwrapEmptySpans: true,
  /** Supprime les éléments devenus vides. */
  removeEmptyElements: true,
  /** Fusionne les marques identiques imbriquées. */
  mergeNestedMarks: true,
  /** Compacte les espaces insécables en série et les blancs multiples. */
  normalizeWhitespace: true,
  /** Remonte les paragraphes imbriqués et supprime les <br> superflus. */
  normalizeBlocks: true,
  /** Nombre maximal de passes de purge des éléments vides. */
  maxPasses: 5,
};

/**
 * Profil LOAD — ouverture d'un contenu existant.
 *
 * Volontairement minimal : scripts, styles, balises Office et gestionnaires
 * d'événements partent, rien d'autre. On ne modifie jamais la mise en forme
 * d'un contenu que l'utilisateur n'a pas demandé à nettoyer, sinon ouvrir puis
 * enregistrer un formulaire réécrirait la base en silence.
 */
export const CLEAN_LOAD = {
  ...BASE_OPTIONS,
  allowedTags: null,
  tagAliases: null,
  allowedAttributes: null,
  keepClasses: null,
  convertDivToP: false,
  unwrapEmptySpans: false,
  removeEmptyElements: false,
  mergeNestedMarks: false,
  normalizeWhitespace: false,
  normalizeBlocks: false,
  allowedStyles: null,
  neutralStyleValues: null,
  defaultFontSizes: [],
  defaultFontFamilies: [],
};

/**
 * Profil PASTE — collage. Le bruit part, la mise en forme voulue reste.
 */
export const CLEAN_PASTE = {
  ...BASE_OPTIONS,
};

/**
 * Profil STRICT — bouton « Nettoyer ».
 */
export const CLEAN_STRICT = {
  ...BASE_OPTIONS,
  dropStyles: STRICT_DROP_STYLES,
};

export const CLEAN_PROFILES = {
  load: CLEAN_LOAD,
  paste: CLEAN_PASTE,
  strict: CLEAN_STRICT,
};
