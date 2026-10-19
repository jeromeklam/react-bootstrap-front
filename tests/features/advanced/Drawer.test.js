/**
 * `__mocks__/react-dom.js` mocke react-dom : on s'en désinscrit pour monter le tiroir
 * pour de vrai (le Portal a besoin de createPortal).
 */
jest.unmock('react-dom');

import React from 'react';
import ReactDOM from 'react-dom';
import Drawer from '../../../src/features/advanced/Drawer';

/* Pas d'act() de react-dom/test-utils : il ne retrouve pas les internes du
   react-dom réactivé. React 16 applique les mises à jour des gestionnaires DOM de
   façon synchrone, un rendu direct suffit (comme DropdownPlacement.test.js). */
const act = fn => fn();

let container = null;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  window.localStorage.clear();
});
afterEach(() => {
  act(() => {
    ReactDOM.unmountComponentAtNode(container);
  });
  container.remove();
  container = null;
});
const render = element => act(() => { ReactDOM.render(element, container); });
const panel = () => document.body.querySelector('.rbf-drawer');

test('fermé : rien ; ouvert : un dialogue dans le body, largeur et décalage donnés', () => {
  render(<Drawer open={false} onClose={() => {}}>contenu</Drawer>);
  expect(panel()).toBeNull();
  render(<Drawer open onClose={() => {}} title="Critères avancés" top={60} width={560}>contenu</Drawer>);
  const aside = panel();
  expect(aside).not.toBeNull();
  expect(aside.getAttribute('role')).toBe('dialog');
  expect(aside.getAttribute('aria-label')).toBe('Critères avancés');
  expect(aside.style.width).toBe('560px');
  expect(aside.style.top).toBe('60px');
  expect(aside.textContent).toContain('contenu');
  expect(container.querySelector('.rbf-drawer')).toBeNull();
});

test('Échap, la croix et le fond ferment ; pas le contenu', () => {
  const onClose = jest.fn();
  render(<Drawer open onClose={onClose}>contenu</Drawer>);
  act(() => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); });
  expect(onClose).toHaveBeenCalledTimes(1);
  act(() => { document.body.querySelector('.rbf-drawer-close').click(); });
  expect(onClose).toHaveBeenCalledTimes(2);
  act(() => { document.body.querySelector('.rbf-drawer-backdrop').click(); });
  expect(onClose).toHaveBeenCalledTimes(3);
  act(() => { document.body.querySelector('.rbf-drawer-body').click(); });
  expect(onClose).toHaveBeenCalledTimes(3);
  render(<Drawer open onClose={onClose} closeOnBackdrop={false} closeOnEscape={false}>contenu</Drawer>);
  act(() => { document.body.querySelector('.rbf-drawer-backdrop').click(); });
  act(() => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); });
  expect(onClose).toHaveBeenCalledTimes(3);
});

test('agrandir / réduire : largeur étendue, mémorisé sous la clé', () => {
  const onExpandToggle = jest.fn();
  render(<Drawer open onClose={() => {}} width={500} expandedWidth="80vw" storageKey="client" onExpandToggle={onExpandToggle}>contenu</Drawer>);
  const button = document.body.querySelector('.rbf-drawer-expand');
  expect(button.getAttribute('title')).toBe('Agrandir');
  act(() => { button.click(); });
  expect(panel().style.width).toBe('80vw');
  expect(panel().classList.contains('rbf-drawer-expanded')).toBe(true);
  expect(onExpandToggle).toHaveBeenCalledWith(true);
  expect(window.localStorage.getItem('rbf.drawer.client.expanded')).toBe('1');
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  render(<Drawer open onClose={() => {}} width={500} expandedWidth="80vw" storageKey="client">contenu</Drawer>);
  expect(panel().style.width).toBe('80vw');
  expect(document.body.querySelector('.rbf-drawer-expand').getAttribute('title')).toBe('Réduire');
});

test('contrôlé : expanded suit la prop ; non extensible : pas de bouton ; pied', () => {
  render(<Drawer open onClose={() => {}} expanded width={400} expandedWidth={900} footer={<b>pied</b>}>contenu</Drawer>);
  expect(panel().style.width).toBe('900px');
  expect(document.body.querySelector('.rbf-drawer-footer').textContent).toBe('pied');
  render(<Drawer open onClose={() => {}} expandable={false}>contenu</Drawer>);
  expect(document.body.querySelector('.rbf-drawer-expand')).toBeNull();
});

test('le focus passe au panneau à l’ouverture et revient ensuite', () => {
  jest.useFakeTimers();
  const trigger = document.createElement('button');
  document.body.appendChild(trigger);
  trigger.focus();
  render(<Drawer open onClose={() => {}}>contenu</Drawer>);
  act(() => { jest.runOnlyPendingTimers(); });
  expect(document.activeElement).toBe(panel());
  render(<Drawer open={false} onClose={() => {}}>contenu</Drawer>);
  expect(document.activeElement).toBe(trigger);
  trigger.remove();
  jest.useRealTimers();
});
