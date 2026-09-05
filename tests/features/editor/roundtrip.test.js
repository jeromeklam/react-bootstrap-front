import { Editor } from '@tiptap/core';
import { buildExtensions } from '../../../src/features/editor/buildExtensions';
import { normalizeLegacyHtml } from '../../../src/features/editor/html/normalizeLegacyHtml';
import { serialize } from '../../../src/features/editor/html/serialize';
import { LEGACY_DRAFT } from './__fixtures__/legacyDraft';

/**
 * Aller-retour à travers l'éditeur.
 *
 * C'est le test qui compte le plus du lot : il vérifie qu'un contenu écrit par
 * l'ancien éditeur draft-js ressort de TipTap sans perte. Toute régression ici
 * signifie une base réécrite de travers à la première ouverture d'un
 * formulaire.
 */
function makeEditor(content, options) {
  return new Editor({
    element: document.createElement('div'),
    extensions: buildExtensions(options || {}),
    content: content,
  });
}

/**
 * Reproduit exactement ce que le composant écrit en base : chargement par
 * normalizeLegacyHtml, puis sortie par serialize — et non `getHTML()` brut,
 * qui n'est pas ce qui est enregistré.
 */
function roundtrip(html, options) {
  const editor = makeEditor(normalizeLegacyHtml(html, options && options.legacy), options);
  const out = serialize(editor);
  editor.destroy();
  return out;
}

/**
 * Texte visible, tous blancs retirés — insécables comprises.
 *
 * L'invariant qui compte est « aucun mot n'est perdu ». Les blancs, eux,
 * bougent légitimement : un paragraphe vide devient `<p>&nbsp;</p>` à la
 * sérialisation, précisément pour que la ligne blanche survive à l'envoi.
 */
function textOf(html) {
  const doc = new DOMParser().parseFromString('<div id="t">' + html + '</div>', 'text/html');
  return doc.getElementById('t').textContent.replace(/[\s\u00a0]+/g, '');
}

describe('aller-retour — contenu écrit par l\'ancien éditeur', () => {
  const out = roundtrip(LEGACY_DRAFT);

  it('conserve les variables de fusion à l\'identique', () => {
    expect(out).toContain('[[:head_group.notification_main_header:]]');
    expect(out).toContain('[[:client.cli_fullname:]]');
  });

  it('conserve la taille de police', () => {
    expect(out).toMatch(/font-size:\s*14px/);
  });

  it('conserve la couleur', () => {
    expect(out.toLowerCase()).toMatch(/color:\s*#c00000/);
  });

  it('conserve souligné, barré, exposant et indice', () => {
    expect(out).toContain('<u>');
    expect(out).toContain('<s>');
    expect(out).toContain('<sup>');
    expect(out).toContain('<sub>');
  });

  it('conserve le lien', () => {
    expect(out).toContain('href="https://kalaweit.org"');
  });

  it('n\'ajoute ni target ni rel aux liens existants', () => {
    /* Les défauts de l'extension Link posent target="_blank" et un rel sur
       tout lien. Les laisser réécrirait l'intégralité des liens de la base
       au premier enregistrement. */
    expect(out).not.toContain('target=');
    expect(out).not.toContain('rel=');
  });

  it('rend les couleurs en hexadécimal, pas en rgb()', () => {
    /* Le navigateur normalise toute couleur en rgb() : sans conversion, chaque
       enregistrement réécrirait les couleurs de la base. */
    expect(out).not.toContain('rgb(');
  });

  it('conserve l\'image et ses dimensions', () => {
    expect(out).toContain('src="https://kalaweit.org/photo.jpg"');
    expect(out).toContain('width="200"');
    expect(out).toContain('height="120"');
  });

  it('conserve le gras', () => {
    expect(out).toContain('<strong>');
  });

  it('transforme <cite> en <em> au lieu de le perdre', () => {
    expect(out).toContain('<em>votre soutien</em>');
  });

  it('remonte l\'alignement du span vers le paragraphe', () => {
    expect(out).toMatch(/<p[^>]*text-align:\s*center[^>]*>Ligne centrée/);
  });

  it('ne perd aucun texte', () => {
    expect(textOf(out)).toBe(textOf(LEGACY_DRAFT));
  });

  it('est stable au second passage', () => {
    expect(roundtrip(out)).toBe(out);
  });
});

describe('aller-retour — schéma', () => {
  it('conserve les titres', () => {
    expect(roundtrip('<h1>a</h1><h2>b</h2><h3>c</h3>')).toBe('<h1>a</h1><h2>b</h2><h3>c</h3>');
  });

  it('conserve les listes', () => {
    expect(roundtrip('<ul><li><p>a</p></li></ul>')).toContain('<ul>');
    expect(roundtrip('<ol><li><p>a</p></li></ol>')).toContain('<ol>');
  });

  it('conserve la citation et le filet', () => {
    expect(roundtrip('<blockquote><p>a</p></blockquote>')).toContain('<blockquote>');
    expect(roundtrip('<p>a</p><hr><p>b</p>')).toContain('<hr>');
  });

  it('conserve l\'alignement des paragraphes', () => {
    expect(roundtrip('<p style="text-align: right">a</p>')).toMatch(/text-align:\s*right/);
  });

  it('conserve la police', () => {
    expect(roundtrip('<p><span style="font-family: Georgia">a</span></p>').toLowerCase()).toContain('georgia');
  });

  it('combine couleur, police et taille dans un seul span', () => {
    const out = roundtrip('<p><span style="color: #ff0000; font-family: Georgia; font-size: 18px">a</span></p>');
    expect(out.match(/<span/g).length).toBe(1);
    expect(out.toLowerCase()).toContain('#ff0000');
    expect(out.toLowerCase()).toContain('georgia');
    expect(out).toContain('18px');
  });

  it('convertit le gras Google Docs exprimé en font-weight', () => {
    expect(roundtrip('<p><span style="font-weight: 700">a</span></p>')).toContain('<strong>');
  });

  it('conserve un paragraphe vide, qui est une ligne blanche voulue', () => {
    const out = roundtrip('<p>a</p><p></p><p>b</p>');
    expect(out.match(/<p/g).length).toBe(3);
  });
});

describe('aller-retour — sérialisation vers la base', () => {
  it('rend une chaîne vide sur un document vide, pour que required fonctionne', () => {
    const editor = makeEditor('');
    expect(serialize(editor)).toBe('');
    editor.destroy();
  });

  it('remplit les paragraphes vides', () => {
    const editor = makeEditor('<p>a</p><p></p>');
    expect(serialize(editor)).toBe('<p>a</p><p>&nbsp;</p>');
    editor.destroy();
  });
});

describe('chargement d\'un contenu — la règle d\'or', () => {
  it('setContent(html, false) ne déclenche jamais onUpdate', () => {
    const onUpdate = jest.fn();
    const editor = new Editor({
      element: document.createElement('div'),
      extensions: buildExtensions({}),
      content: '<p>a</p>',
      onUpdate,
    });
    editor.commands.setContent('<p>b</p>', false);
    expect(onUpdate).not.toHaveBeenCalled();
    editor.destroy();
  });
});

describe('collage', () => {
  it('le nettoyage au collage est branché sur l\'éditeur', () => {
    const editor = makeEditor('<p>a</p>');
    const transform = editor.view.someProp('transformPastedHTML');
    expect(typeof transform).toBe('function');
    const cleaned = transform('<p class="MsoNormal"><span style="mso-x:1; font-family: Calibri">a</span></p>');
    expect(cleaned.toLowerCase()).not.toContain('mso');
    expect(cleaned.toLowerCase()).not.toContain('calibri');
    editor.destroy();
  });
});

describe('variables de fusion — décoration', () => {
  it('décore les variables connues et signale les inconnues', () => {
    const mergeVars = [{ key: 'client', group: 'Donateur', items: [{ code: '[[:client.cli_fullname:]]', label: 'Nom' }] }];
    const editor = makeEditor('<p>[[:client.cli_fullname:]] et [[:client.inconnu:]]</p>', { mergeVars });
    const html = editor.view.dom.innerHTML;
    expect(html).toContain('rbf-mergevar');
    expect(html).toContain('rbf-mergevar-unknown');
    editor.destroy();
  });
});
