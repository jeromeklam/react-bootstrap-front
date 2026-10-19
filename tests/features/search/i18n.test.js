import { tr, warnOnce } from '../../../src/features/search';

test('tr avec rbfIntl : valeurs interpolées après coup', () => {
  expect(tr(undefined, 'rbf.test.inexistante', '{n} valeurs', { n: 16 })).toBe('16 valeurs');
  expect(tr(undefined, 'rbf.search.facet.count', '{n} valeurs', { n: 16 })).toBe('16 sélectionnée(s)');
  expect(tr(null, 'rbf.inconnu', 'Texte {a} et {b}', { a: 1 })).toBe('Texte 1 et {b}');
});

test('tr avec un t à la formatMessage : le texte rendu est respecté', () => {
  const t = (desc, values) => `${desc.id}:${values.n}`;
  expect(tr(t, 'x', 'défaut', { n: 3 })).toBe('x:3');
  expect(tr(() => '', 'x', 'défaut {n}', { n: 3 })).toBe('défaut 3');
});

test('warnOnce : un seul avertissement par message', () => {
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  warnOnce('test unique');
  warnOnce('test unique');
  warnOnce('autre');
  expect(spy).toHaveBeenCalledTimes(2);
  spy.mockRestore();
});
