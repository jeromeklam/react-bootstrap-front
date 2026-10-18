import React from 'react';
import renderer from 'react-test-renderer';
import { Filter, FILTER_MODE_AND, FILTER_OPER_LIKE, FILTER_OPER_EMPTY } from '../../../src/features/filter';
import { SearchSummary } from '../../../src/features/search';
import { donorCatalog } from './fixtures';

const filterWith = () => {
  const f = new Filter();
  f.init(FILTER_MODE_AND, FILTER_OPER_LIKE);
  f.setFilterRange('last_donation.don_real_ts', '2025-01-01', '2025-12-31');
  f.replaceFilter('cli_email', [], FILTER_OPER_EMPTY);
  return f;
};
const texts = (tree, type) => tree.root.findAllByType(type).map(n => n.children.join(''));

test('encart : titre en capitales, fond clair, valeurs en gras', () => {
  const tree = renderer.create(<SearchSummary filter={filterWith()} catalog={donorCatalog()} subject="Donateurs" />);
  const box = tree.root.findByProps({ role: 'status' });
  expect(box.props.className).toContain('bg-light');
  expect(texts(tree, 'strong')).toEqual(['Donateurs', '01/01/2025', '31/12/2025']);
  expect(tree.root.findAll(n => n.type === 'div' && typeof n.props.className === 'string' && n.props.className.includes('text-uppercase'))[0].children).toEqual(['En clair']);
  expect(tree.toJSON().children[1].children.map(c => (typeof c === 'string' ? c : c.children.join(''))).join('')).toBe(
    'Donateurs dont le dernier paiement est entre le 01/01/2025 et le 31/12/2025, sans e-mail.'
  );
});

test('en ligne : un span, pas de titre', () => {
  const tree = renderer.create(<SearchSummary variant="inline" filter={filterWith()} catalog={donorCatalog()} subject="Donateurs" />);
  expect(tree.toJSON().type).toBe('span');
  expect(tree.root.findAllByProps({ role: 'status' }).length).toBe(0);
  expect(texts(tree, 'strong')[0]).toBe('Donateurs');
});

test('sans critère : texte vide, thème et titre personnalisables', () => {
  const empty = new Filter();
  empty.init(FILTER_MODE_AND, FILTER_OPER_LIKE);
  const tree = renderer.create(<SearchSummary filter={empty} catalog={donorCatalog()} theme="white" title="Résumé" emptyText="Rien" />);
  expect(tree.root.findByProps({ role: 'status' }).props.className).toContain('bg-white');
  expect(texts(tree, 'span')).toEqual(['Rien']);
  expect(tree.toJSON().children[0].children).toEqual(['Résumé']);
});
