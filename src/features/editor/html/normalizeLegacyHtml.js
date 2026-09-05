import { cleanHtml } from './cleanHtml';

/**
 * Compatibilité avec les contenus produits par l'ancien éditeur draft-js.
 *
 * L'ancien `toHtml` (features/draft/InputHtml.js) est la spécification exacte de
 * ce qui se trouve en base. Ce module rattrape les tournures que le schéma de
 * l'éditeur ne saurait pas relire, AVANT que le contenu ne lui soit confié :
 *
 *  - `<cite>`  : draft-js écrivait la marque CODE ainsi. Inconnue du schéma,
 *                elle produirait du texte nu et la mise en forme serait perdue.
 *  - `<span style="text-align:…">` : l'alignement était posé sur de l'inline,
 *                où il n'a aucun effet. On le remonte sur le bloc parent.
 *  - `<br>` isolé entre deux blocs : c'était un paragraphe vide. Laissé tel
 *                quel, il ferait fusionner les deux paragraphes voisins.
 *  - `<span data-mailmerge="…">` : enveloppe d'une variable de fusion. Le texte
 *                à l'intérieur est la variable elle-même, on garde le texte.
 *
 * Rien ici ne supprime de mise en forme : la fonction est appelée à chaque
 * ouverture d'un contenu, elle doit être neutre pour tout ce qu'elle ne
 * reconnaît pas.
 */

const BLOCK_ANCESTORS = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'blockquote', 'td', 'th', 'div'];

const DEFAULTS = {
  /** Ce que devient `<cite>` : 'em' (défaut), 'code' ou 'strip'. */
  citeAs: 'em',
  /** Passe de nettoyage minimal (profil LOAD) avant les rattrapages. */
  clean: true,
  /** Remonte `text-align` d'un span vers son bloc. */
  liftTextAlign: true,
  /** Convertit les `<br>` inter-blocs en paragraphes vides. */
  brToParagraph: true,
  /** Déballe les enveloppes de variables de fusion. */
  unwrapMailmerge: true,
};

function parseRoot(html) {
  if (typeof DOMParser === 'undefined') {
    return null;
  }
  const doc = new DOMParser().parseFromString('<div id="rbf-legacy-root">' + html + '</div>', 'text/html');
  return doc.getElementById('rbf-legacy-root');
}

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

function rename(el, tagName) {
  const next = el.ownerDocument.createElement(tagName);
  const attrs = el.attributes;
  for (let i = 0; i < attrs.length; i++) {
    try {
      next.setAttribute(attrs[i].name, attrs[i].value);
    } catch (e) {
      /* nom d'attribut invalide */
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

/**
 * `<cite>` était la marque CODE de draft-js.
 */
function handleCite(root, citeAs) {
  const cites = Array.prototype.slice.call(root.getElementsByTagName('cite'));
  for (let i = cites.length - 1; i >= 0; i--) {
    if (citeAs === 'strip') {
      unwrap(cites[i]);
    } else {
      rename(cites[i], citeAs === 'code' ? 'code' : 'em');
    }
  }
}

/**
 * L'alignement posé sur un span inline n'a aucun effet : on le remonte sur le
 * premier bloc ancêtre, qui est le seul endroit où l'éditeur saura le relire.
 */
function liftTextAlign(root) {
  const spans = Array.prototype.slice.call(root.getElementsByTagName('span'));
  for (let i = 0; i < spans.length; i++) {
    const span = spans[i];
    const style = span.getAttribute('style');
    if (!style || style.indexOf('text-align') === -1) {
      continue;
    }
    const match = /text-align\s*:\s*([a-z]+)/i.exec(style);
    if (!match) {
      continue;
    }
    const align = match[1].toLowerCase();
    span.setAttribute('style', style.replace(/text-align\s*:\s*[a-z]+\s*;?/i, '').trim());
    if ((span.getAttribute('style') || '').replace(/[\s;]/g, '') === '') {
      span.removeAttribute('style');
    }
    const block = closestBlock(span, root);
    if (block && !/text-align/i.test(block.getAttribute('style') || '')) {
      const existing = block.getAttribute('style');
      block.setAttribute(
        'style',
        existing ? existing.replace(/;?\s*$/, '; ') + 'text-align: ' + align : 'text-align: ' + align,
      );
    }
    /* Le span n'était là que pour porter l'alignement : il n'a plus d'objet. */
    if (span.attributes.length === 0) {
      unwrap(span);
    }
  }
}

function closestBlock(el, root) {
  let node = el.parentNode;
  while (node && node !== root && node.nodeType === 1) {
    if (BLOCK_ANCESTORS.indexOf(node.tagName.toLowerCase()) !== -1) {
      return node;
    }
    node = node.parentNode;
  }
  return null;
}

/**
 * draft-convert écrivait un `<br>` nu pour un paragraphe vide (blockToHTML
 * retournait `<br />` sur un bloc `unstyled` sans texte). Au niveau racine, ce
 * `<br>` doit redevenir un paragraphe, sinon les blocs voisins fusionnent.
 */
function brToParagraph(root) {
  const brs = Array.prototype.slice.call(root.childNodes);
  for (let i = 0; i < brs.length; i++) {
    const node = brs[i];
    if (node.nodeType !== 1 || node.tagName.toLowerCase() !== 'br') {
      continue;
    }
    const p = root.ownerDocument.createElement('p');
    root.replaceChild(p, node);
  }
}

/**
 * `<span data-mailmerge="…">[[:code:]]</span>` : le texte intérieur est la
 * variable, on le conserve tel quel et on jette l'enveloppe.
 */
function unwrapMailmerge(root) {
  const spans = Array.prototype.slice.call(root.querySelectorAll('span[data-mailmerge]'));
  for (let i = spans.length - 1; i >= 0; i--) {
    unwrap(spans[i]);
  }
}

/**
 * Prépare un contenu HTML existant pour l'éditeur.
 *
 * @param {string} html
 * @param {object} options  cf. DEFAULTS
 * @returns {string}
 */
export function normalizeLegacyHtml(html, options) {
  if (html === null || html === undefined || html === '') {
    return '';
  }
  const opts = { ...DEFAULTS, ...(options || {}) };
  const base = opts.clean ? cleanHtml(html, 'load') : String(html);
  const root = parseRoot(base);
  if (!root) {
    return base;
  }
  handleCite(root, opts.citeAs);
  if (opts.unwrapMailmerge) {
    unwrapMailmerge(root);
  }
  if (opts.liftTextAlign) {
    liftTextAlign(root);
  }
  if (opts.brToParagraph) {
    brToParagraph(root);
  }
  return root.innerHTML;
}

export default normalizeLegacyHtml;
