import { normalizeLegacyHtml } from '../../../src/features/editor/html/normalizeLegacyHtml';
import { LEGACY_DRAFT } from './__fixtures__/legacyDraft';

function textOf(html) {
  const doc = new DOMParser().parseFromString('<div id="t">' + html + '</div>', 'text/html');
  return doc.getElementById('t').textContent;
}

describe('normalizeLegacyHtml — <cite>, la marque CODE de draft-js', () => {
  it('devient <em> par défaut', () => {
    const out = normalizeLegacyHtml('<p>a <cite>b</cite> c</p>');
    expect(out).toContain('<em>b</em>');
    expect(out).not.toContain('cite');
  });

  it('peut devenir <code>', () => {
    expect(normalizeLegacyHtml('<p><cite>b</cite></p>', { citeAs: 'code' })).toContain('<code>b</code>');
  });

  it('peut être déballé sans perdre le texte', () => {
    const out = normalizeLegacyHtml('<p>a <cite>b</cite> c</p>', { citeAs: 'strip' });
    expect(out).not.toContain('cite');
    expect(textOf(out)).toBe('a b c');
  });
});

describe('normalizeLegacyHtml — alignement posé sur de l\'inline', () => {
  it('remonte text-align du span vers le bloc', () => {
    const out = normalizeLegacyHtml('<p><span style="text-align:center">Centré</span></p>');
    expect(out).toMatch(/<p[^>]*text-align:\s*center/);
    expect(out).not.toMatch(/<span[^>]*text-align/);
  });

  it('ne touche pas à un alignement déjà porté par le bloc', () => {
    const out = normalizeLegacyHtml('<p style="text-align: right"><span style="text-align:center">a</span></p>');
    expect(out).toContain('text-align: right');
    expect(out).not.toContain('center');
  });

  it('conserve les autres styles du span', () => {
    const out = normalizeLegacyHtml('<p><span style="color:#ff0000;text-align:center">a</span></p>');
    expect(out).toContain('#ff0000');
    expect(out).toMatch(/<p[^>]*text-align:\s*center/);
  });
});

describe('normalizeLegacyHtml — paragraphe vide écrit en <br>', () => {
  it('convertit un <br> de premier niveau en paragraphe vide', () => {
    const out = normalizeLegacyHtml('<p>a</p><br/><p>b</p>');
    expect(out).toBe('<p>a</p><p></p><p>b</p>');
  });

  it('ne touche pas à un <br> à l\'intérieur d\'un paragraphe', () => {
    expect(normalizeLegacyHtml('<p>a<br/>b</p>')).toBe('<p>a<br>b</p>');
  });
});

describe('normalizeLegacyHtml — enveloppe de variable de fusion', () => {
  it('déballe le span en conservant le code', () => {
    const out = normalizeLegacyHtml('<p><span data-mailmerge="{originalText}">[[:client.cli_fullname:]]</span></p>');
    expect(out).toBe('<p>[[:client.cli_fullname:]]</p>');
  });
});

describe('normalizeLegacyHtml — neutralité', () => {
  it('conserve couleurs, tailles, soulignés, exposants et liens', () => {
    const out = normalizeLegacyHtml(LEGACY_DRAFT);
    expect(out).toMatch(/font-size:\s*14px/);
    expect(out).toMatch(/color:\s*#c00000/);
    expect(out).toContain('<u>Souligné</u>');
    expect(out).toContain('<sup>2</sup>');
    expect(out).toContain('<sub>2</sub>');
    expect(out).toContain('href="https://kalaweit.org"');
  });

  it('conserve les dimensions de l\'image', () => {
    const out = normalizeLegacyHtml(LEGACY_DRAFT);
    expect(out).toContain('height="120"');
    expect(out).toContain('width="200"');
  });

  it('conserve les variables de fusion telles quelles', () => {
    const out = normalizeLegacyHtml(LEGACY_DRAFT);
    expect(out).toContain('[[:head_group.notification_main_header:]]');
    expect(out).toContain('[[:client.cli_fullname:]]');
  });

  it('ne perd aucun texte', () => {
    expect(textOf(normalizeLegacyHtml(LEGACY_DRAFT))).toBe(textOf(LEGACY_DRAFT));
  });

  it('est idempotent', () => {
    const once = normalizeLegacyHtml(LEGACY_DRAFT);
    expect(normalizeLegacyHtml(once)).toBe(once);
  });

  it('rend une chaîne vide sur une entrée vide', () => {
    expect(normalizeLegacyHtml('')).toBe('');
    expect(normalizeLegacyHtml(null)).toBe('');
    expect(normalizeLegacyHtml(undefined)).toBe('');
  });
});
