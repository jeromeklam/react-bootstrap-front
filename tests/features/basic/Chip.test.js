import React from 'react';
import renderer from 'react-test-renderer';
import { Chip } from '../../../src/features/basic';

const buttons = tree => tree.root.findAllByType('button');

test('bascule : outline au repos, pleine et pressée quand active', () => {
  const tree = renderer.create(<Chip variant="toggle" label="Particulier" />);
  let [btn] = buttons(tree);
  expect(btn.props.className).toContain('btn-outline-secondary');
  expect(btn.props['aria-pressed']).toBe(false);
  renderer.act(() => {
    tree.update(<Chip variant="toggle" label="Particulier" active checkIcon={<i className="check" />} />);
  });
  [btn] = buttons(tree);
  expect(btn.props.className).toContain('btn-secondary');
  expect(btn.props.className).toContain('active');
  expect(btn.props['aria-pressed']).toBe(true);
  expect(tree.root.findAll(n => n.props.className === 'check').length).toBe(1);
});

test('critère actif : le × appelle onRemove, pas onClick', () => {
  const onClick = jest.fn();
  const onRemove = jest.fn();
  const tree = renderer.create(<Chip variant="active" label="Don : Régulier" onClick={onClick} onRemove={onRemove} />);
  const [main, remove] = buttons(tree);
  expect(remove.props['aria-label']).toBe('Retirer');
  renderer.act(() => remove.props.onClick());
  expect(onRemove).toHaveBeenCalledTimes(1);
  expect(onClick).not.toHaveBeenCalled();
});

test('facette : chevron, compteur et état déroulé', () => {
  const tree = renderer.create(
    <Chip variant="facet" label="Moyen de paiement" count={2} active caretIcon={<i className="caret" />} />
  );
  const [btn] = buttons(tree);
  expect(buttons(tree).length).toBe(1);
  expect(btn.props['aria-haspopup']).toBe('dialog');
  expect(btn.props['aria-expanded']).toBe(true);
  expect(tree.root.findAll(n => n.props.className === 'caret').length).toBe(1);
  const badge = tree.root.find(n => typeof n.props.className === 'string' && n.props.className.includes('rbf-chip-count'));
  expect(badge.children).toEqual(['2']);
});

test('ajout : variante en pointillés, thème au choix', () => {
  const tree = renderer.create(<Chip variant="add" theme="primary" label="+ Critère" />);
  const wrapper = tree.root.find(n => typeof n.props.className === 'string' && n.props.className.includes('rbf-chip-add'));
  expect(wrapper).toBeDefined();
  expect(buttons(tree)[0].props.className).toContain('btn-outline-primary');
});

test('la référence pointe sur le bouton principal', () => {
  const ref = React.createRef();
  renderer.create(<Chip ref={ref} label="Ancre" />, {
    createNodeMock: element => ({ tagName: element.type.toUpperCase() }),
  });
  expect(ref.current.tagName).toBe('BUTTON');
});
