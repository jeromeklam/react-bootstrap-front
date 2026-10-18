import React from 'react';
import renderer from 'react-test-renderer';
import { InputSegmented } from '../../../src/features/basic';

const OPTIONS = [
  { value: '', label: 'Tous' },
  { value: 'regular', label: 'Régulier' },
  { value: 'once', label: 'Ponctuel' },
];
const buttons = tree => tree.root.findAllByType('button');

test('le choix courant est plein et pressé, les autres en contour', () => {
  const tree = renderer.create(<InputSegmented name="don_kind" value="regular" options={OPTIONS} onChange={() => {}} />);
  const [all, regular, once] = buttons(tree);
  expect(all.props.className).toContain('btn-outline-secondary');
  expect(regular.props.className).toContain('btn-secondary active');
  expect(regular.props['aria-pressed']).toBe(true);
  expect(once.props['aria-pressed']).toBe(false);
});

test('un clic émet { target: { name, value } }', () => {
  const onChange = jest.fn();
  const tree = renderer.create(<InputSegmented name="don_kind" value="" options={OPTIONS} onChange={onChange} />);
  renderer.act(() => buttons(tree)[2].props.onClick());
  expect(onChange).toHaveBeenCalledWith({ target: { name: 'don_kind', value: 'once' } });
});

test('re-cliquer le choix courant ne vide que si allowEmpty', () => {
  const onChange = jest.fn();
  const tree = renderer.create(<InputSegmented name="k" value="once" options={OPTIONS} onChange={onChange} />);
  renderer.act(() => buttons(tree)[2].props.onClick());
  expect(onChange).toHaveBeenLastCalledWith({ target: { name: 'k', value: 'once' } });
  renderer.act(() => {
    tree.update(<InputSegmented name="k" value="once" options={OPTIONS} onChange={onChange} allowEmpty />);
  });
  renderer.act(() => buttons(tree)[2].props.onClick());
  expect(onChange).toHaveBeenLastCalledWith({ target: { name: 'k', value: '' } });
});

test('libellé, aide et valeur numérique', () => {
  const tree = renderer.create(
    <InputSegmented name="n" label="Don" help="Un seul choix" value={2} options={[{ value: 1, label: 'Un' }, { value: 2, label: 'Deux' }]} onChange={() => {}} />
  );
  expect(tree.root.findByType('label').children).toEqual(['Don']);
  expect(tree.root.findByType('small').children).toEqual(['Un seul choix']);
  expect(buttons(tree)[1].props['aria-pressed']).toBe(true);
});
