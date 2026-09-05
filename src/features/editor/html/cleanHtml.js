import { CLEAN_PASTE, CLEAN_PROFILES } from './cleanHtml.constants';

/**
 *******************************************************************************
 * Pré-nettoyage textuel
 *******************************************************************************
 */

const PRE_CLEAN_PATTERNS = [
  /* Commentaires conditionnels Word : <!--[if gte mso 9]> ... <![endif]--> */
  [/<!--\[if[\s\S]*?<!\[endif\]-->/gi, ''],
  /* Commentaires (StartFragment, EndFragment, tout le reste) */
  [/<!--[\s\S]*?-->/g, ''],
  /* Déclarations */
  [/<!DOCTYPE[^>]*>/gi, ''],
  /* Blocs entiers à jeter avec leur contenu : Word injecte des kilo-octets de <style> */
  [/<(script|style|xml|head|title|noscript)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, ''],
  /* Les mêmes, non refermés */
  [/<(script|style|xml|head|title|noscript)\b[^>]*>/gi, ''],
  /* Balises à namespace Office : <o:p>, <v:shape>, <w:sdt> */
  [/<\/?[a-z][a-z0-9]*:[^>]*>/gi, ''],
  /* Marques de position invisibles */
  [/[\u200b\u200c\u200d\ufeff]/g, ''],
];

function preClean(html) {
  let out = String(html);
  for (let i = 0; i < PRE_CLEAN_PATTERNS.length; i++) {
    out = out.replace(PRE_CLEAN_PATTERNS[i][0], PRE_CLEAN_PATTERNS[i][1]);
  }
  return out;
}

/**
 *******************************************************************************
 * Styles : analyse et sérialisation
 *******************************************************************************
 */

/**
 * Découpe un attribut style en couples [propriété, valeur].
 * Le découpage respecte les parenthèses et les guillemets, sans quoi un
 * `url(data:image/png;base64,...)` ou un `font-family: "a;b"` casserait tout.
 */
export function parseStyle(value) {
  const pairs = [];
  const str = String(value || '');
  let depth = 0;
  let quote = null;
  let current = '';
  for (let i = 0; i < str.length; i++) {
    const c = str.charAt(i);
    if (quote) {
      current += c;
      if (c === quote && str.charAt(i - 1) !== '\\') {
        quote = null;
      }
      continue;
    }
    if (c === '"' || c === "'") {
      quote = c;
      current += c;
      continue;
    }
    if (c === '(') {
      depth++;
    } else if (c === ')') {
      depth = Math.max(0, depth - 1);
    }
    if (c === ';' && depth === 0) {
      pushPair(pairs, current);
      current = '';
      continue;
    }
    current += c;
  }
  pushPair(pairs, current);
  return pairs;
}

function pushPair(pairs, chunk) {
  const trimmed = chunk.trim();
  if (trimmed === '') {
    return;
  }
  const idx = trimmed.indexOf(':');
  if (idx <= 0) {
    return;
  }
  const prop = trimmed
    .slice(0, idx)
    .trim()
    .toLowerCase();
  const val = trimmed.slice(idx + 1).trim();
  if (prop === '' || val === '') {
    return;
  }
  pairs.push([prop, val]);
}

export function serializeStyle(pairs) {
  const parts = [];
  for (let i = 0; i < pairs.length; i++) {
    parts.push(pairs[i][0] + ': ' + pairs[i][1]);
  }
  return parts.join('; ');
}

/**
 * Normalise une valeur CSS pour la comparer : minuscules, guillemets retirés,
 * espaces compactés puis supprimés autour des virgules.
 * `"Times New Roman", serif` et `'times new roman',serif` donnent le même résultat.
 */
function normalizeCssValue(value) {
  return String(value)
    .toLowerCase()
    .replace(/["']/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*,\s*/g, ',')
    .replace(/!\s*important$/, '')
    .trim();
}

/**
 * Normalise une longueur CSS pour la comparer : `11.0pt` et `11pt` désignent la
 * même chose, et Word écrit systématiquement la première forme.
 */
function normalizeCssLength(value) {
  const match = /^([0-9]*\.?[0-9]+)\s*([a-z%]*)$/.exec(value);
  if (!match) {
    return value;
  }
  return parseFloat(match[1]) + match[2];
}

/**
 *******************************************************************************
 * Aides DOM
 *******************************************************************************
 */

const BLOCK_TAGS = [
  'p',
  'div',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
  'blockquote',
  'hr',
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'td',
  'th',
  'pre',
];

function isBlockTag(tag) {
  return BLOCK_TAGS.indexOf(tag) !== -1;
}

function remove(node) {
  if (node && node.parentNode) {
    node.parentNode.removeChild(node);
  }
}

/**
 * Remplace un élément par ses enfants. Le texte n'est jamais perdu.
 */
function unwrap(el) {
  const parent = el.parentNode;
  if (!parent) {
    return;
  }
  while (el.firstChild) {
    parent.insertBefore(el.firstChild, el);
  }
  parent.removeChild(el);
}

/**
 * Renomme un élément en conservant attributs et enfants.
 * Retourne le nouvel élément.
 */
function rename(el, tagName) {
  const doc = el.ownerDocument;
  const next = doc.createElement(tagName);
  const attrs = el.attributes;
  for (let i = 0; i < attrs.length; i++) {
    try {
      next.setAttribute(attrs[i].name, attrs[i].value);
    } catch (e) {
      /* nom d'attribut invalide : on le laisse tomber */
    }
  }
  while (el.firstChild) {
    next.appendChild(el.firstChild);
  }
  if (el.parentNode) {
    el.parentNode.replaceChild(next, el);
  }
  return next;
}

function getScheme(url) {
  const match = /^\s*([a-z][a-z0-9+.-]*:)/i.exec(String(url || ''));
  return match ? match[1].toLowerCase() : null;
}

function isDataImage(url) {
  return /^\s*data:image\//i.test(String(url || ''));
}

function hasContent(el) {
  /* Le nbsp compte comme du contenu : c'est une ligne blanche voulue. */
  return el.textContent.replace(/[^\S\u00a0]+/g, '') !== '';
}

/**
 *******************************************************************************
 * Traitement d'un élément
 *******************************************************************************
 */

function cleanAttributes(el, tag, opts) {
  const attrs = Array.prototype.slice.call(el.attributes);
  for (let i = 0; i < attrs.length; i++) {
    const name = attrs[i].name.toLowerCase();
    if (name === 'style' || name === 'class') {
      continue;
    }
    /* Gestionnaires d'événements et bruit Office */
    if (name.indexOf('on') === 0 || name.indexOf('mso-') === 0 || name.indexOf(':') !== -1) {
      el.removeAttribute(attrs[i].name);
      continue;
    }
    if (opts.allowedAttributes) {
      const allowed = (opts.allowedAttributes['*'] || []).concat(opts.allowedAttributes[tag] || []);
      if (allowed.indexOf(name) === -1) {
        el.removeAttribute(attrs[i].name);
      }
    }
  }
  /* Liens : un schéma exotique perd son href, l'élément reste (le texte survit) */
  if (el.hasAttribute('href')) {
    const scheme = getScheme(el.getAttribute('href'));
    if (scheme !== null && opts.allowedHrefSchemes.indexOf(scheme) === -1) {
      el.removeAttribute('href');
    }
  }
  /* Images : un src inutilisable fait disparaître l'élément, une image inerte n'a pas de sens */
  if (el.hasAttribute('src')) {
    const src = el.getAttribute('src');
    const scheme = getScheme(src);
    const ok =
      scheme === null ||
      opts.allowedSrcSchemes.indexOf(scheme) !== -1 ||
      (opts.allowDataImages && isDataImage(src));
    if (!ok) {
      return false;
    }
  }
  return true;
}

function cleanClasses(el, opts) {
  if (!el.hasAttribute('class')) {
    return;
  }
  if (opts.keepClasses === null) {
    return;
  }
  const keep = [];
  const classes = el.getAttribute('class').split(/\s+/);
  for (let i = 0; i < classes.length; i++) {
    if (classes[i] !== '' && opts.keepClasses.indexOf(classes[i]) !== -1) {
      keep.push(classes[i]);
    }
  }
  if (keep.length > 0) {
    el.setAttribute('class', keep.join(' '));
  } else {
    el.removeAttribute('class');
  }
}

function cleanStyle(el, opts) {
  if (!el.hasAttribute('style')) {
    return;
  }
  const pairs = parseStyle(el.getAttribute('style'));
  const kept = [];
  for (let i = 0; i < pairs.length; i++) {
    const prop = pairs[i][0];
    const raw = pairs[i][1];
    const value = normalizeCssValue(raw);

    if (prop.indexOf('mso-') === 0 || prop.indexOf('-webkit-') === 0 || prop.indexOf('-moz-') === 0) {
      continue;
    }
    if (opts.allowedStyles && opts.allowedStyles.indexOf(prop) === -1) {
      continue;
    }
    if (opts.dropStyles && opts.dropStyles.indexOf(prop) !== -1) {
      continue;
    }
    if (opts.neutralStyleValues) {
      const neutral = opts.neutralStyleValues[prop];
      if (neutral && neutral.indexOf(value) !== -1) {
        continue;
      }
    }
    if (prop === 'font-size' && opts.defaultFontSizes.indexOf(normalizeCssLength(value)) !== -1) {
      continue;
    }
    if (prop === 'font-family' && opts.defaultFontFamilies.indexOf(value) !== -1) {
      continue;
    }
    kept.push([prop, raw]);
  }
  if (kept.length > 0) {
    el.setAttribute('style', serializeStyle(kept));
  } else {
    el.removeAttribute('style');
  }
}

/**
 * Traduit les attributs de présentation de <font> en style.
 */
const FONT_SIZE_MAP = { 1: '8pt', 2: '10pt', 3: '12pt', 4: '14pt', 5: '18pt', 6: '24pt', 7: '36pt' };

function fontToStyle(el) {
  const pairs = parseStyle(el.getAttribute('style') || '');
  const color = el.getAttribute('color');
  const face = el.getAttribute('face');
  const size = el.getAttribute('size');
  if (color) {
    pairs.push(['color', color]);
  }
  if (face) {
    pairs.push(['font-family', face]);
  }
  if (size && FONT_SIZE_MAP[size]) {
    pairs.push(['font-size', FONT_SIZE_MAP[size]]);
  }
  el.removeAttribute('color');
  el.removeAttribute('face');
  el.removeAttribute('size');
  if (pairs.length > 0) {
    el.setAttribute('style', serializeStyle(pairs));
  }
}

function processElement(el, opts) {
  let tag = el.tagName.toLowerCase();

  /* 1. Balises jetées avec leur contenu */
  if (opts.dropTags.indexOf(tag) !== -1) {
    remove(el);
    return;
  }

  /* 2. Signature Google Docs : <b style="font-weight:normal"> enveloppe tout le collage */
  if (tag === 'b' || tag === 'strong') {
    const style = normalizeCssValue(el.getAttribute('style') || '');
    if (/font-weight:\s*(normal|400)/.test(style)) {
      unwrap(el);
      return;
    }
  }

  /* 3. <font> : les attributs de présentation deviennent du style */
  if (tag === 'font') {
    fontToStyle(el);
    el = rename(el, 'span');
    tag = 'span';
  }

  /* 4. Balises historiques */
  if (opts.tagAliases && opts.tagAliases[tag]) {
    el = rename(el, opts.tagAliases[tag]);
    tag = el.tagName.toLowerCase();
  }

  /* 5. Attributs, classes, styles */
  if (!cleanAttributes(el, tag, opts)) {
    remove(el);
    return;
  }
  cleanClasses(el, opts);
  cleanStyle(el, opts);

  /* 6. <div> : bloc s'il contient des blocs, sinon paragraphe */
  if (tag === 'div' && opts.convertDivToP) {
    if (containsBlock(el)) {
      unwrap(el);
    } else {
      el = rename(el, 'p');
      tag = 'p';
    }
    return;
  }

  /* 7. Balises inconnues : déballées, jamais supprimées */
  if (opts.allowedTags && opts.allowedTags.indexOf(tag) === -1) {
    unwrap(el);
    return;
  }

  /* 8. <span> devenu inutile : c'est le cas le plus fréquent d'un collage Word */
  if (tag === 'span' && opts.unwrapEmptySpans && el.attributes.length === 0) {
    unwrap(el);
    return;
  }

  /* 9. Marques identiques imbriquées */
  if (opts.mergeNestedMarks && el.parentNode && el.parentNode.nodeType === 1) {
    const parent = el.parentNode;
    if (
      parent.tagName.toLowerCase() === tag &&
      parent.childNodes.length === 1 &&
      (el.getAttribute('style') || '') === (parent.getAttribute('style') || '')
    ) {
      unwrap(el);
    }
  }
}

function containsBlock(el) {
  const children = el.children || [];
  for (let i = 0; i < children.length; i++) {
    if (isBlockTag(children[i].tagName.toLowerCase())) {
      return true;
    }
  }
  return false;
}

/**
 * Parcours profondeur d'abord, post-ordre : les enfants sont traités avant leur
 * parent, ce qui permet au parent de constater qu'il est devenu inutile.
 */
function walk(node, opts) {
  const children = Array.prototype.slice.call(node.childNodes);
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.nodeType === 1) {
      walk(child, opts);
      if (child.parentNode) {
        processElement(child, opts);
      }
    } else if (child.nodeType === 8) {
      remove(child);
    }
  }
}

/**
 *******************************************************************************
 * Passes de finition
 *******************************************************************************
 */

/**
 * Supprime les éléments devenus vides, en itérant jusqu'au point fixe : sans
 * cela une cascade `<p><span><span></span></span></p>` ne serait purgée que
 * d'un niveau par passe.
 */
function removeEmptyElements(root, opts) {
  for (let pass = 0; pass < opts.maxPasses; pass++) {
    const empties = [];
    const all = root.getElementsByTagName('*');
    for (let i = 0; i < all.length; i++) {
      const el = all[i];
      const tag = el.tagName.toLowerCase();
      if (opts.keepEmptyTags.indexOf(tag) !== -1) {
        continue;
      }
      if (el.getElementsByTagName('*').length === 0 && !hasContent(el)) {
        empties.push(el);
      }
    }
    if (empties.length === 0) {
      return;
    }
    for (let i = 0; i < empties.length; i++) {
      remove(empties[i]);
    }
  }
}

/**
 * Vrai si le texte ne contient que des blancs ordinaires. L'insécable n'en est
 * pas un ici : c'est une espace ou une ligne voulue par le rédacteur.
 * String.trim() ne convient pas, il retire aussi les insécables.
 */
function isBlankText(value) {
  return /^[^\S\u00a0]*$/.test(value);
}

/**
 * Un nœud texte est « entre blocs » si ses deux voisins significatifs sont
 * absents ou de niveau bloc. Le test préserve l'espace de `a <em>b</em>`.
 */
function isBlockBoundary(node) {
  if (!node) {
    return true;
  }
  return node.nodeType === 1 && isBlockTag(node.tagName.toLowerCase());
}

function isBetweenBlocks(node) {
  return isBlockBoundary(previousMeaningful(node)) && isBlockBoundary(nextMeaningful(node));
}

function normalizeWhitespace(root) {
  /* Les déballages ont laissé des nœuds texte adjacents : les fusionner
     d'abord, sans quoi un double blanc resterait invisible d'une passe sur
     l'autre et le nettoyage ne serait pas idempotent. */
  root.normalize();

  const nodes = [];
  collectTextNodes(root, nodes);
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    /* Blanc d'indentation entre deux blocs : il n'apporte rien et son sort
       varie d'une passe à l'autre. */
    if (isBlankText(node.nodeValue) && isBetweenBlocks(node)) {
      remove(node);
      continue;
    }

    let text = node.nodeValue;
    /* Une suite d'insécables sert d'indentation : un espace suffit */
    text = text.replace(/\u00a0{2,}/g, ' ');
    /* Blancs multiples : le HTML les rend de toute façon comme un seul */
    text = text.replace(/[^\S\u00a0]{2,}/g, ' ');
    if (text !== node.nodeValue) {
      node.nodeValue = text;
    }
  }
}

function collectTextNodes(node, out) {
  const children = node.childNodes;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.nodeType === 3) {
      out.push(child);
    } else if (child.nodeType === 1) {
      collectTextNodes(child, out);
    }
  }
}

/**
 * Normalisation des blocs : paragraphes imbriqués remontés, <br> superflus.
 */
function normalizeBlocks(root) {
  /* <p> dans <p> : on remonte l'intérieur */
  let nested = root.querySelectorAll('p p, li p > p');
  for (let i = nested.length - 1; i >= 0; i--) {
    unwrap(nested[i]);
  }

  /* <br> en fin de bloc : invisible, mais il ajoute une ligne à l'impression */
  const blocks = root.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, blockquote');
  for (let i = 0; i < blocks.length; i++) {
    let last = blocks[i].lastChild;
    /* isBlankText et non trim() : une insécable finale est une ligne blanche
       voulue, la retirer viderait le paragraphe qui serait ensuite purgé. */
    while (last && last.nodeType === 3 && isBlankText(last.nodeValue)) {
      const previous = last.previousSibling;
      remove(last);
      last = previous;
    }
    if (last && last.nodeType === 1 && last.tagName.toLowerCase() === 'br') {
      remove(last);
    }
  }

  /* Trois <br> ou plus à la suite : deux suffisent */
  const brs = Array.prototype.slice.call(root.getElementsByTagName('br'));
  let run = 0;
  for (let i = 0; i < brs.length; i++) {
    const br = brs[i];
    const previous = previousMeaningful(br);
    if (previous && previous.nodeType === 1 && previous.tagName.toLowerCase() === 'br') {
      run++;
      if (run >= 2) {
        remove(br);
      }
    } else {
      run = 0;
    }
  }
}

function previousMeaningful(node) {
  let previous = node.previousSibling;
  while (previous && previous.nodeType === 3 && isBlankText(previous.nodeValue)) {
    previous = previous.previousSibling;
  }
  return previous;
}

function nextMeaningful(node) {
  let next = node.nextSibling;
  while (next && next.nodeType === 3 && isBlankText(next.nodeValue)) {
    next = next.nextSibling;
  }
  return next;
}

/**
 *******************************************************************************
 * Point d'entrée
 *******************************************************************************
 */

function resolveOptions(options) {
  if (!options) {
    return CLEAN_PASTE;
  }
  if (typeof options === 'string') {
    return CLEAN_PROFILES[options] || CLEAN_PASTE;
  }
  if (options.profile) {
    const base = CLEAN_PROFILES[options.profile] || CLEAN_PASTE;
    return { ...base, ...options };
  }
  return { ...CLEAN_PASTE, ...options };
}

function createRoot(html) {
  if (typeof DOMParser === 'undefined') {
    return null;
  }
  /* DOMParser n'exécute aucun script et ne déclenche aucune requête réseau. */
  const doc = new DOMParser().parseFromString('<div id="rbf-clean-root">' + html + '</div>', 'text/html');
  return doc.getElementById('rbf-clean-root');
}

/**
 * Nettoie un fragment de HTML.
 *
 * @param {string} html    le fragment à nettoyer
 * @param {string|object} options  'load' | 'paste' | 'strict', ou un objet
 *                                 d'options fusionné sur le profil PASTE
 * @returns {string} le HTML nettoyé
 */
export function cleanHtml(html, options) {
  if (html === null || html === undefined || html === '') {
    return '';
  }
  const opts = resolveOptions(options);
  const pre = preClean(html);
  const root = createRoot(pre);
  if (!root) {
    /* Pas de DOM disponible : on rend au moins le pré-nettoyage textuel. */
    return pre;
  }
  walk(root, opts);
  /* L'ordre compte : blancs puis blocs, la purge des éléments vides en dernier.
     Les deux premières passes peuvent vider un élément, et c'est la purge qui
     doit en décider — sinon un contenu propre changerait encore au nettoyage
     suivant et la fonction ne serait pas idempotente. */
  if (opts.normalizeWhitespace) {
    normalizeWhitespace(root);
  }
  if (opts.normalizeBlocks) {
    normalizeBlocks(root);
  }
  if (opts.removeEmptyElements) {
    removeEmptyElements(root, opts);
  }
  return root.innerHTML;
}

export default cleanHtml;
