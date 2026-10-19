import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { FacetPopover } from '../../../src/features/search';
import { Dropdown, InputDateRange } from '../../../src/features/basic';
import { donorCatalog } from './fixtures';

/* react-dom est mocké : Dropdown n'est pas monté pour de vrai, on l'écarte. */
const options = { createNodeMock: () => ({}) };
const field = name => donorCatalog().find(f => f.name === name);
const ref = { current: null };
const inputs = tree => tree.root.findAllByType('input');
const checkboxes = tree => inputs(tree).filter(i => i.props.type === 'checkbox');
const apply = tree => tree.root.findAllByType('button').find(b => b.children.join('') === 'Appliquer');

test('liste à cocher : état initial, bascule, Appliquer émet les valeurs', () => {
  const onApply = jest.fn();
  const tree = renderer.create(
    <FacetPopover field={field('donations.payment_type.ptyp_id')} value={[5]} onApply={onApply} onClose={() => {}} myRef={ref} />,
    options
  );
  expect(tree.root.findAllByType(Dropdown).length).toBe(1);
  expect(checkboxes(tree).map(c => c.props.checked)).toEqual([false, true, false]);
  renderer.act(() => checkboxes(tree)[0].props.onChange());
  expect(checkboxes(tree).map(c => c.props.checked)).toEqual([true, true, false]);
  expect(tree.root.findByType('small').children.join('')).toBe('2 sélectionnée(s)');
  renderer.act(() => apply(tree).props.onClick());
  expect(onApply).toHaveBeenCalledWith([5, 3]);
});

test('champ de filtre à partir de 8 options, insensible aux accents ; Entrée applique, Échap ferme', () => {
  const many = { ...field('donations.payment_type.ptyp_id'), options: ['Alvarum', 'Chèque', 'Espèces', 'Prélèvement', 'Paypal', 'CB', 'Stripe', 'HelloAsso'].map((label, i) => ({ value: i + 1, label })) };
  const onApply = jest.fn();
  const onClose = jest.fn();
  const tree = renderer.create(<FacetPopover field={many} value={[]} onApply={onApply} onClose={onClose} myRef={ref} />, options);
  const query = inputs(tree).find(i => i.props.type === 'text');
  expect(query.props.placeholder).toBe('Filtrer…');
  renderer.act(() => query.props.onChange({ target: { value: 'che' } }));
  expect(checkboxes(tree).length).toBe(1);
  const body = tree.root.findByProps({ role: 'dialog' });
  renderer.act(() => body.props.onKeyDown({ key: 'Enter', preventDefault() {} }));
  expect(onApply).toHaveBeenCalledWith([]);
  renderer.act(() => body.props.onKeyDown({ key: 'Escape', preventDefault() {} }));
  expect(onClose).toHaveBeenCalled();
  const few = renderer.create(<FacetPopover field={field('donations.payment_type.ptyp_id')} onApply={() => {}} onClose={() => {}} myRef={ref} />, options);
  expect(inputs(few).filter(i => i.props.type === 'text').length).toBe(0);
});

/* InputDateWeb (masque + calendrier) ne se monte pas sous react-test-renderer : la
   facette de plage est vérifiée en rendu superficiel. */
test('facette de plage : une plage de dates, Appliquer émet [de, à] ; compteur personnalisé', () => {
  const onApply = jest.fn();
  const w = shallow(
    <FacetPopover field={field('last_donation.don_real_ts')} value={['2025-01-01', '']} onApply={onApply} onClose={() => {}} myRef={ref} icons={{ calendar: <i />, clear: <i /> }} />
  );
  const range = w.find(InputDateRange);
  expect(range.prop('value')).toEqual(['2025-01-01', '']);
  range.prop('onChange')({ target: { value: ['2025-01-01', '2025-12-31'] } });
  w.find('button.btn-primary').simulate('click');
  expect(onApply).toHaveBeenCalledWith(['2025-01-01', '2025-12-31']);
  const counted = { ...field('donations.payment_type.ptyp_id'), facet: { order: 1, countLabel: n => `${n} moyens` } };
  const two = shallow(<FacetPopover field={counted} value={[5, 3]} onApply={() => {}} onClose={() => {}} myRef={ref} />);
  expect(two.find('small').text()).toBe('2 moyens');
});
