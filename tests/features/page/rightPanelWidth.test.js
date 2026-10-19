import React from 'react';
import { shallow } from 'enzyme';
import { maxRightPanelWidth, clampRightPanelWidth } from '../../../src/features/page/rightPanelWidth';
import ResponsivePage from '../../../src/features/page/DefaultPage';

test('bornes : minimum du panneau, place laissée au contenu', () => {
  expect(maxRightPanelWidth(1600, 250, 480, 320)).toBe(870);
  expect(maxRightPanelWidth(900, 250, 480, 320)).toBe(320);
  expect(clampRightPanelWidth(500, 320, 870)).toBe(500);
  expect(clampRightPanelWidth(100, 320, 870)).toBe(320);
  expect(clampRightPanelWidth(2000, 320, 870)).toBe(870);
  expect(clampRightPanelWidth(NaN, 320, 870)).toBe(320);
  expect(clampRightPanelWidth(400.6, 320, 300)).toBe(320);
});

/* Le rendu superficiel ne traverse pas les fonctions de rendu de CSSTransition : la
   mécanique est vérifiée par l'instance. Fenêtre élargie, sinon la borne haute
   (fenêtre − menu − contenu minimal) tombe sur la borne basse. */
const page = props =>
  shallow(
    <ResponsivePage authenticated userForm={<div />} settings={{}} onChangeSettings={() => {}} rightPanel={<div className="panneau" />} {...props}>
      <div>contenu</div>
    </ResponsivePage>
  ).instance();

beforeEach(() => {
  window.localStorage.clear();
  Object.defineProperty(window, 'innerWidth', { value: 1600, configurable: true });
});

test('largeur par défaut, bornes selon la fenêtre et le menu, mémorisation par clé', () => {
  const p = page({ rightPanelOpened: true, rightPanelStorageKey: 'admin' });
  expect(p.rightPanelWidth()).toBe(400);
  expect(p.rightPanelMaxWidth()).toBe(1600 - 250 - 480);
  p.onResizeKey({ key: 'ArrowLeft', preventDefault() {} });
  expect(p.rightPanelWidth()).toBe(416);
  expect(window.localStorage.getItem('rbf.page.rightPanel.admin.width')).toBe('416');
  p.setRightPanelWidth(5000);
  expect(p.rightPanelWidth()).toBe(870);
  p.onResizeKey({ key: 'ArrowRight', preventDefault() {}, shiftKey: true });
  expect(p.rightPanelWidth()).toBe(806);
  expect(page({ rightPanelOpened: true, rightPanelStorageKey: 'admin' }).rightPanelWidth()).toBe(806);
  expect(page({ rightPanelOpened: true }).rightPanelWidth()).toBe(400);
});

test('glisser la poignée vers la gauche élargit, borné au minimum ; relâcher mémorise', () => {
  const onRightPanelResize = jest.fn();
  const p = page({ rightPanelOpened: true, rightPanelStorageKey: 'admin', onRightPanelResize });
  p.onResizeStart({ clientX: 1000, preventDefault() {} });
  p.onResizeMove({ clientX: 900 });
  expect(p.rightPanelWidth()).toBe(500);
  expect(onRightPanelResize).not.toHaveBeenCalled();
  p.onResizeMove({ clientX: 1900 });
  expect(p.rightPanelWidth()).toBe(320);
  p.onResizeEnd();
  expect(onRightPanelResize).toHaveBeenCalledWith(320);
  expect(window.localStorage.getItem('rbf.page.rightPanel.admin.width')).toBe('320');
});

test('contrôlé : la largeur suit la prop, les changements passent par onRightPanelResize', () => {
  const onRightPanelResize = jest.fn();
  const p = page({ rightPanelOpened: true, rightPanelWidth: 500, onRightPanelResize });
  expect(p.rightPanelWidth()).toBe(500);
  p.onResizeKey({ key: 'ArrowRight', preventDefault() {}, shiftKey: true });
  expect(onRightPanelResize).toHaveBeenCalledWith(436);
  expect(p.rightPanelWidth()).toBe(500);
});
