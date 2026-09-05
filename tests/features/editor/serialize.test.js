import { serializeHtml, isEmptyHtml, serialize } from '../../../src/features/editor/html/serialize';

describe('isEmptyHtml', () => {
  it('reconnaît les documents vides', () => {
    expect(isEmptyHtml('')).toBe(true);
    expect(isEmptyHtml(null)).toBe(true);
    expect(isEmptyHtml(undefined)).toBe(true);
    expect(isEmptyHtml('<p></p>')).toBe(true);
    expect(isEmptyHtml('<p>&nbsp;</p>')).toBe(true);
    expect(isEmptyHtml('<p><span style="color:red"></span></p>')).toBe(true);
    expect(isEmptyHtml('   ')).toBe(true);
  });

  it('ne considère pas vide un contenu porteur', () => {
    expect(isEmptyHtml('<p>a</p>')).toBe(false);
    expect(isEmptyHtml('<p><img src="https://x/y.png"></p>')).toBe(false);
    expect(isEmptyHtml('<hr>')).toBe(false);
  });
});

describe('serializeHtml', () => {
  it('rend une chaîne vide sur un document vide, pour que required fonctionne', () => {
    expect(serializeHtml('<p></p>')).toBe('');
    expect(serializeHtml('')).toBe('');
    expect(serializeHtml(null)).toBe('');
  });

  it('remplit les paragraphes vides, que les clients de messagerie effondrent', () => {
    expect(serializeHtml('<p>a</p><p></p><p>b</p>')).toBe('<p>a</p><p>&nbsp;</p><p>b</p>');
  });

  it('remplit aussi un paragraphe vide portant un style', () => {
    expect(serializeHtml('<p>a</p><p style="text-align: center"></p>')).toBe(
      '<p>a</p><p style="text-align: center">&nbsp;</p>',
    );
  });

  it('accepte le <br> comme remplissage', () => {
    expect(serializeHtml('<p>a</p><p></p>', { emptyParagraph: 'br' })).toBe('<p>a</p><p><br></p>');
  });

  it('sait ne rien changer', () => {
    expect(serializeHtml('<p>a</p><p></p>', { emptyParagraph: 'keep' })).toBe('<p>a</p><p></p>');
  });

  it('sait fermer les balises orphelines', () => {
    const out = serializeHtml('<p>a<br><img src="https://x/y.png"></p>', { selfClosing: true });
    expect(out).toContain('<br />');
    expect(out).toContain('<img src="https://x/y.png" />');
  });

  it('laisse le contenu intact par défaut', () => {
    const source = '<p><strong>a</strong> <em>b</em></p><ul><li>c</li></ul>';
    expect(serializeHtml(source)).toBe(source);
  });

  it('est idempotent', () => {
    const once = serializeHtml('<p>a</p><p></p>');
    expect(serializeHtml(once)).toBe(once);
  });
});

describe('serialize', () => {
  it('lit le HTML de l\'éditeur', () => {
    const editor = { getHTML: () => '<p>a</p><p></p>' };
    expect(serialize(editor)).toBe('<p>a</p><p>&nbsp;</p>');
  });

  it('tolère l\'absence d\'éditeur', () => {
    expect(serialize(null)).toBe('');
  });
});
