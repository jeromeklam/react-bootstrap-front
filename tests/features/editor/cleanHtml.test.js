import { cleanHtml, parseStyle, serializeStyle } from '../../../src/features/editor/html/cleanHtml';
import { WORD_PASTE } from './__fixtures__/wordPaste';
import { GOOGLE_DOCS_PASTE } from './__fixtures__/googleDocsPaste';

/**
 * Texte visible d'un fragment HTML, blancs normalisés.
 * Sert à vérifier qu'aucun nettoyage ne perd de contenu.
 */
function visibleText(html) {
  /* Une fin de bloc vaut une séparation : le blanc d'indentation entre deux
     <p> n'est pas rendu par le navigateur, le nettoyeur a donc raison de le
     supprimer. Sans cette normalisation on comparerait des choses différentes. */
  const withBreaks = String(html)
    .replace(/<\/(p|div|h[1-6]|li|tr|blockquote|ul|ol)\s*>/gi, '$& ')
    .replace(/<br\s*\/?>/gi, ' ');
  const doc = new DOMParser().parseFromString('<div id="t">' + withBreaks + '</div>', 'text/html');
  return doc
    .getElementById('t')
    .textContent.replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Les blocs <script>/<style> et les commentaires conditionnels sont supprimés
 * avec leur contenu : c'est voulu, on les retire aussi du texte de référence.
 */
function visibleTextWithoutNoise(html) {
  const stripped = String(html)
    .replace(/<!--\[if[\s\S]*?<!\[endif\]-->/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|xml|head|title|noscript)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '');
  return visibleText(stripped);
}

function countTags(html, tag) {
  const re = new RegExp('<' + tag + '\\b', 'gi');
  const found = html.match(re);
  return found ? found.length : 0;
}

describe('parseStyle', () => {
  it('découpe des couples simples', () => {
    expect(parseStyle('color: red; font-size: 12px')).toEqual([['color', 'red'], ['font-size', '12px']]);
  });

  it('ne casse pas sur un point-virgule entre parenthèses', () => {
    const pairs = parseStyle('background-image: url(data:image/png;base64,AAA); color: red');
    expect(pairs).toEqual([['background-image', 'url(data:image/png;base64,AAA)'], ['color', 'red']]);
  });

  it('ne casse pas sur un point-virgule entre guillemets', () => {
    expect(parseStyle('font-family: "a;b"; color: red')).toEqual([['font-family', '"a;b"'], ['color', 'red']]);
  });

  it('ignore les fragments sans valeur', () => {
    expect(parseStyle('color:;;font-size: 12px;')).toEqual([['font-size', '12px']]);
  });

  it('fait un aller-retour stable', () => {
    const style = 'color: red; font-size: 12px';
    expect(serializeStyle(parseStyle(style))).toBe(style);
  });
});

describe('cleanHtml — non-destruction du texte', () => {
  it('conserve tout le texte d\'un collage Word', () => {
    const cleaned = cleanHtml(WORD_PASTE, 'paste');
    expect(visibleText(cleaned)).toBe(visibleTextWithoutNoise(WORD_PASTE));
  });

  it('conserve tout le texte d\'un collage Google Docs', () => {
    const cleaned = cleanHtml(GOOGLE_DOCS_PASTE, 'paste');
    expect(visibleText(cleaned)).toBe(visibleTextWithoutNoise(GOOGLE_DOCS_PASTE));
  });

  it('conserve le texte même en profil STRICT', () => {
    const cleaned = cleanHtml(WORD_PASTE, 'strict');
    expect(visibleText(cleaned)).toBe(visibleTextWithoutNoise(WORD_PASTE));
  });

  it('ne perd pas le texte d\'une balise inconnue, il la déballe', () => {
    expect(visibleText(cleanHtml('<p>a <mark>b</mark> c</p>', 'paste'))).toBe('a b c');
    expect(cleanHtml('<p>a <mark>b</mark> c</p>', 'paste')).not.toContain('<mark');
  });
});

describe('cleanHtml — idempotence', () => {
  it('est stable sur un collage Word', () => {
    const once = cleanHtml(WORD_PASTE, 'paste');
    expect(cleanHtml(once, 'paste')).toBe(once);
  });

  it('est stable sur un collage Google Docs', () => {
    const once = cleanHtml(GOOGLE_DOCS_PASTE, 'paste');
    expect(cleanHtml(once, 'paste')).toBe(once);
  });

  it('est stable en profil STRICT', () => {
    const once = cleanHtml(WORD_PASTE, 'strict');
    expect(cleanHtml(once, 'strict')).toBe(once);
  });
});

describe('cleanHtml — bruit Word', () => {
  const cleaned = cleanHtml(WORD_PASTE, 'paste');

  it('supprime toute trace de mso', () => {
    expect(cleaned.toLowerCase()).not.toContain('mso');
  });

  it('supprime les classes Mso*', () => {
    expect(cleaned).not.toContain('class=');
  });

  it('supprime les balises Office', () => {
    expect(cleaned.toLowerCase()).not.toContain('<o:p');
  });

  it('supprime la feuille de style embarquée et le head', () => {
    expect(cleaned.toLowerCase()).not.toContain('<style');
    expect(cleaned.toLowerCase()).not.toContain('font-face');
    expect(cleaned.toLowerCase()).not.toContain('<meta');
  });

  it('supprime les commentaires conditionnels', () => {
    expect(cleaned).not.toContain('<!--');
    expect(cleaned).not.toContain('supportLists');
  });

  it('fait tomber le nombre de spans', () => {
    expect(countTags(WORD_PASTE, 'span')).toBeGreaterThan(4);
    expect(countTags(cleaned, 'span')).toBeLessThanOrEqual(2);
  });

  it('conserve la couleur voulue mais pas la police par défaut', () => {
    expect(cleaned.toLowerCase()).toContain('#c00000');
    expect(cleaned.toLowerCase()).not.toContain('calibri');
  });

  it('conserve l\'alignement du paragraphe', () => {
    expect(cleaned).toContain('text-align');
  });
});

describe('cleanHtml — bruit Google Docs', () => {
  const cleaned = cleanHtml(GOOGLE_DOCS_PASTE, 'paste');

  it('déballe le <b style="font-weight:normal"> englobant', () => {
    expect(cleaned).not.toMatch(/<b[\s>]/);
    expect(cleaned).not.toContain('<strong');
  });

  it('supprime l\'identifiant interne', () => {
    expect(cleaned).not.toContain('docs-internal-guid');
  });

  it('supprime les valeurs neutres', () => {
    expect(cleaned).not.toContain('font-weight: 400');
    expect(cleaned).not.toContain('background-color: transparent');
    expect(cleaned).not.toContain('vertical-align: baseline');
    expect(cleaned).not.toContain('text-decoration: none');
  });

  it('conserve la couleur signifiante', () => {
    expect(cleaned.toLowerCase()).toContain('#ff0000');
  });
});

describe('cleanHtml — profil STRICT', () => {
  const source = '<p style="text-align: center"><span style="color: #ff0000; font-family: Georgia; font-size: 24px"><strong>Titre</strong></span></p>';

  it('retire couleur, police et taille', () => {
    const cleaned = cleanHtml(source, 'strict');
    expect(cleaned).not.toContain('color');
    expect(cleaned).not.toContain('font-family');
    expect(cleaned).not.toContain('font-size');
  });

  it('conserve le gras et l\'alignement', () => {
    const cleaned = cleanHtml(source, 'strict');
    expect(cleaned).toContain('<strong>');
    expect(cleaned).toContain('text-align');
  });

  it('déballe le span devenu inutile', () => {
    expect(cleanHtml(source, 'strict')).not.toContain('<span');
  });

  it('laisse le profil PASTE conserver la mise en forme', () => {
    const cleaned = cleanHtml(source, 'paste');
    expect(cleaned.toLowerCase()).toContain('#ff0000');
    expect(cleaned.toLowerCase()).toContain('georgia');
    expect(cleaned).toContain('24px');
  });
});

describe('cleanHtml — profil LOAD', () => {
  it('ne touche pas à la mise en forme', () => {
    const source = '<p style="text-align: center"><span style="color: #ff0000; font-size: 14px">Bonjour</span></p>';
    const cleaned = cleanHtml(source, 'load');
    expect(cleaned).toContain('#ff0000');
    expect(cleaned).toContain('14px');
    expect(cleaned).toContain('text-align');
    expect(cleaned).toContain('<span');
  });

  it('supprime tout de même scripts et balises Office', () => {
    const cleaned = cleanHtml('<p>a<o:p></o:p></p><script>alert(1)</script>', 'load');
    expect(cleaned).not.toContain('script');
    expect(cleaned).not.toContain('o:p');
    expect(visibleText(cleaned)).toBe('a');
  });

  it('conserve les classes', () => {
    expect(cleanHtml('<p class="ma-classe">a</p>', 'load')).toContain('ma-classe');
  });
});

describe('cleanHtml — sécurité', () => {
  it('supprime les gestionnaires d\'événements', () => {
    const cleaned = cleanHtml('<p onclick="alert(1)">a</p><img src="https://x/y.png" onerror="alert(1)">', 'paste');
    expect(cleaned).not.toContain('onclick');
    expect(cleaned).not.toContain('onerror');
  });

  it('neutralise un href javascript: mais garde le texte', () => {
    const cleaned = cleanHtml('<p><a href="javascript:alert(1)">clic</a></p>', 'paste');
    expect(cleaned).not.toContain('javascript:');
    expect(visibleText(cleaned)).toBe('clic');
  });

  it('supprime une image à src javascript:', () => {
    expect(cleanHtml('<p><img src="javascript:alert(1)"></p>', 'paste')).not.toContain('<img');
  });

  it('conserve une image en data-url', () => {
    const src = 'data:image/png;base64,iVBORw0KGgo=';
    expect(cleanHtml('<p><img src="' + src + '"></p>', 'paste')).toContain('data:image/png');
  });

  it('supprime scripts, iframes et formulaires avec leur contenu', () => {
    const cleaned = cleanHtml('<p>a</p><iframe src="https://x"></iframe><form><input name="a"></form>', 'paste');
    expect(cleaned).not.toContain('iframe');
    expect(cleaned).not.toContain('<form');
    expect(cleaned).not.toContain('<input');
  });
});

describe('cleanHtml — structure', () => {
  it('convertit les balises historiques', () => {
    const cleaned = cleanHtml('<p><b>a</b> <i>b</i> <strike>c</strike></p>', 'paste');
    expect(cleaned).toContain('<strong>a</strong>');
    expect(cleaned).toContain('<em>b</em>');
    expect(cleaned).toContain('<s>c</s>');
  });

  it('traduit <font> en style', () => {
    const cleaned = cleanHtml('<p><font color="#ff0000" face="Georgia" size="5">a</font></p>', 'paste');
    expect(cleaned).not.toContain('<font');
    expect(cleaned.toLowerCase()).toContain('#ff0000');
    expect(cleaned.toLowerCase()).toContain('georgia');
    expect(cleaned).toContain('18pt');
  });

  it('transforme un div simple en paragraphe', () => {
    expect(cleanHtml('<div>a</div>', 'paste')).toBe('<p>a</p>');
  });

  it('déballe un div qui contient des blocs', () => {
    const cleaned = cleanHtml('<div><p>a</p><p>b</p></div>', 'paste');
    expect(cleaned).toBe('<p>a</p><p>b</p>');
  });

  it('purge les cascades d\'éléments vides jusqu\'au point fixe', () => {
    expect(cleanHtml('<p><span><span><em></em></span></span></p>', 'paste')).toBe('');
  });

  it('conserve un paragraphe contenant une insécable, c\'est une ligne blanche voulue', () => {
    expect(cleanHtml('<p>&nbsp;</p>', 'paste')).toContain('<p>');
  });

  it('fusionne les marques identiques imbriquées', () => {
    expect(cleanHtml('<p><strong><strong>a</strong></strong></p>', 'paste')).toBe('<p><strong>a</strong></p>');
  });

  it('supprime un <br> en fin de bloc', () => {
    expect(cleanHtml('<p>a<br></p>', 'paste')).toBe('<p>a</p>');
  });

  it('ramène trois <br> ou plus à deux', () => {
    const cleaned = cleanHtml('<p>a</p><br><br><br><br><p>b</p>', 'paste');
    expect(countTags(cleaned, 'br')).toBe(2);
  });

  it('conserve les images et leurs dimensions', () => {
    const cleaned = cleanHtml('<p><img src="https://x/y.png" width="200" height="120" alt="chat"></p>', 'paste');
    expect(cleaned).toContain('width="200"');
    expect(cleaned).toContain('height="120"');
    expect(cleaned).toContain('alt="chat"');
  });

  it('rend une chaîne vide sur une entrée vide', () => {
    expect(cleanHtml('', 'paste')).toBe('');
    expect(cleanHtml(null, 'paste')).toBe('');
    expect(cleanHtml(undefined, 'paste')).toBe('');
  });
});
