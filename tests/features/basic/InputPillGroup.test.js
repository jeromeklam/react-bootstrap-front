import React from 'react';
import renderer from 'react-test-renderer';
import { InputPillGroup } from '../../../src/features/basic';

const OPTIONS = [
  { value: 1, label: 'Administration' },
  { value: 2, label: 'Entreprise' },
  { value: 3, label: 'Particulier' },
];
const buttons = tree => tree.root.findAllByType('button');

test('les valeurs choisies sont pleines, même si le type diffère', () => {
  const tree = renderer.create(<InputPillGroup name="clic_id" value={['3']} options={OPTIONS} onChange={() => {}} />);
  const pressed = buttons(tree).map(b => b.props['aria-pressed']);
  expect(pressed).toEqual([false, false, true]);
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
