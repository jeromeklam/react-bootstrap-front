import React from 'react';
import renderer from 'react-test-renderer';
import { InputPillGroup } from '../../../src/features/basic';

const OPTIONS = [
  { value: 1, label: 'Administration' },
  { value: 2, label: 'Entreprise' },
  { value: 3, label: 'Particulier' },
];
const buttons = tree => tree.root.findAllByType('button');
const pills = tree => buttons(tree).filter(b => typeof b.props['aria-pressed'] === 'boolean');
const tool = (tree, cls) => buttons(tree).find(b => String(b.props.className).includes(cls));

test('les valeurs choisies sont pleines, même si le type diffère', () => {
  const tree = renderer.create(<InputPillGroup name="clic_id" value={['3']} options={OPTIONS} onChange={() => {}} />);
  const pressed = pills(tree).map(b => b.props['aria-pressed']);
  expect(pressed).toEqual([false, false, true]);
});

test('les options terminées sont masquées sauf si choisies ; un lien les affiche puis les masque', () => {
  const withEnded = [...OPTIONS, { value: 4, label: 'Alvarum', ended: true }, { value: 5, label: 'Kunbis', ended: true }];
  const tree = renderer.create(<InputPillGroup name="ptyp" value={[5]} options={withEnded} onChange={() => {}} />);
  const pills = () => buttons(tree).filter(b => typeof b.props['aria-pressed'] === 'boolean');
  const toggle = () => buttons(tree).find(b => String(b.props.className).includes('rbf-pill-group-ended'));
  expect(pills().length).toBe(4);
  expect(toggle().children.join('')).toBe('Afficher aussi les 1 terminé(s)');
  renderer.act(() => toggle().props.onClick());
  expect(pills().length).toBe(5);
  expect(toggle().children.join('')).toBe('Masquer les terminés');
  renderer.act(() => toggle().props.onClick());
  expect(pills().length).toBe(4);
  const none = renderer.create(<InputPillGroup name="ptyp" value={[]} options={OPTIONS} onChange={() => {}} />);
  expect(none.root.findAllByType('button').filter(b => typeof b.props['aria-pressed'] === 'boolean').length).toBe(3);
  expect(none.root.findAllByType('button').find(b => String(b.props.className).includes('rbf-pill-group-ended'))).toBeUndefined();
});

test('un clic ajoute, un second retire', () => {
  const onChange = jest.fn();
  const tree = renderer.create(<InputPillGroup name="clic_id" value={[3]} options={OPTIONS} onChange={onChange} />);
  renderer.act(() => buttons(tree)[1].props.onClick());
  expect(onChange).toHaveBeenLastCalledWith({ target: { name: 'clic_id', value: [3, 2] } });
  renderer.act(() => buttons(tree)[2].props.onClick());
  expect(onChange).toHaveBeenLastCalledWith({ target: { name: 'clic_id', value: [] } });
});

test('multiple={false} remplace le choix', () => {
  const onChange = jest.fn();
  const tree = renderer.create(<InputPillGroup name="k" value={[1]} options={OPTIONS} onChange={onChange} multiple={false} />);
  renderer.act(() => buttons(tree)[2].props.onClick());
  expect(onChange).toHaveBeenLastCalledWith({ target: { name: 'k', value: [3] } });
});

test('indication et libellé', () => {
  const tree = renderer.create(
    <InputPillGroup name="k" label="Catégorie" hint="Aucune cochée = toutes" options={OPTIONS} onChange={() => {}} />
  );
  expect(tree.root.findByType('label').children).toEqual(['Catégorie']);
  expect(tree.root.findByType('small').children).toEqual(['Aucune cochée = toutes']);
});

test('aucune valeur = toutes cochées ; en décocher une garde les autres ; recocher la dernière revient à toutes', () => {
  const onChange = jest.fn();
  const tree = renderer.create(<InputPillGroup name="k" value={[]} options={OPTIONS} onChange={onChange} />);
  expect(pills(tree).map(b => b.props['aria-pressed'])).toEqual([true, true, true]);
  renderer.act(() => pills(tree)[0].props.onClick());
  expect(onChange).toHaveBeenLastCalledWith({ target: { name: 'k', value: [2, 3] } });
  const two = renderer.create(<InputPillGroup name="k" value={[2, 3]} options={OPTIONS} onChange={onChange} />);
  expect(pills(two).map(b => b.props['aria-pressed'])).toEqual([false, true, true]);
  renderer.act(() => pills(two)[0].props.onClick());
  expect(onChange).toHaveBeenLastCalledWith({ target: { name: 'k', value: [] } });
});

test('Tous / Aucun : Aucun vide l’affichage, le premier choix ne garde que lui, Tous revient au tableau vide', () => {
  const onChange = jest.fn();
  const tree = renderer.create(<InputPillGroup name="k" value={[]} options={OPTIONS} onChange={onChange} />);
  expect(tool(tree, 'rbf-pill-group-all').props.disabled).toBe(true);
  expect(tool(tree, 'rbf-pill-group-none').props.disabled).toBe(false);
  renderer.act(() => tool(tree, 'rbf-pill-group-none').props.onClick());
  expect(onChange).toHaveBeenLastCalledWith({ target: { name: 'k', value: [] } });
  expect(pills(tree).map(b => b.props['aria-pressed'])).toEqual([false, false, false]);
  expect(tool(tree, 'rbf-pill-group-none').props.disabled).toBe(true);
  renderer.act(() => pills(tree)[1].props.onClick());
  expect(onChange).toHaveBeenLastCalledWith({ target: { name: 'k', value: [2] } });
  renderer.act(() => tool(tree, 'rbf-pill-group-all').props.onClick());
  expect(onChange).toHaveBeenLastCalledWith({ target: { name: 'k', value: [] } });
  expect(pills(tree).map(b => b.props['aria-pressed'])).toEqual([true, true, true]);
  const single = renderer.create(<InputPillGroup name="k" value={[]} options={OPTIONS} onChange={onChange} multiple={false} />);
  expect(tool(single, 'rbf-pill-group-all')).toBeUndefined();
  expect(pills(single).map(b => b.props['aria-pressed'])).toEqual([false, false, false]);
});

test('les terminées masquées restent hors de « toutes »', () => {
  const onChange = jest.fn();
  const withEnded = [...OPTIONS, { value: 4, label: 'Alvarum', ended: true }];
  const tree = renderer.create(<InputPillGroup name="ptyp" value={[]} options={withEnded} onChange={onChange} />);
  expect(pills(tree).map(b => b.props['aria-pressed'])).toEqual([true, true, true]);
  renderer.act(() => pills(tree)[2].props.onClick());
  expect(onChange).toHaveBeenLastCalledWith({ target: { name: 'ptyp', value: [1, 2] } });
});
