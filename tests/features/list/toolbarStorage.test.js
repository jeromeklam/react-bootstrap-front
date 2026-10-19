import { readToolbarOpen, writeToolbarOpen } from '../../../src/features/list/toolbarStorage';

beforeEach(() => window.localStorage.clear());

test('sans clé : la valeur par défaut, rien d’écrit', () => {
  expect(readToolbarOpen(null)).toBe(false);
  expect(readToolbarOpen(undefined, true)).toBe(true);
  writeToolbarOpen(null, true);
  expect(window.localStorage.length).toBe(0);
});

test('avec clé : mémorisé par liste', () => {
  expect(readToolbarOpen('client')).toBe(false);
  writeToolbarOpen('client', true);
  expect(readToolbarOpen('client')).toBe(true);
  expect(readToolbarOpen('donation')).toBe(false);
  writeToolbarOpen('client', false);
  expect(readToolbarOpen('client', true)).toBe(false);
  expect(window.localStorage.getItem('rbf.list.toolbar.client')).toBe('0');
});

test('stockage refusé : silencieux', () => {
  const original = window.localStorage.setItem;
  window.localStorage.setItem = () => {
    throw new Error('refusé');
  };
  expect(() => writeToolbarOpen('client', true)).not.toThrow();
  window.localStorage.setItem = original;
});
