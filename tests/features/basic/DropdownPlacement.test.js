/**
 * `__mocks__/react-dom.js` mocke automatiquement tout react-dom, ce qui
 * neutralise `render` et `createPortal`. On s'en désinscrit ici pour pouvoir
 * monter réellement le composant et lire sa position.
 */
jest.unmock('react-dom');

import React from 'react';
import ReactDOM from 'react-dom';
import Dropdown from '../../../src/features/basic/Dropdown';
import DropdownWrapper from '../../../src/features/advanced/DropdownWrapper';
import { computePlacement } from '../../../src/features/basic/computePlacement';

/**
 * Placement des menus déroulants.
 *
 * jsdom ne fait aucune mise en page : getBoundingClientRect rend des zéros. On
 * simule donc une ancre et une taille de menu, ce qui est exactement ce dont
 * dépend le calcul de position.
 */
const VIEWPORT = { width: 1280, height: 800 };

let container = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  window.innerWidth = VIEWPORT.width;
  window.innerHeight = VIEWPORT.height;
});

afterEach(() => {
  if (container) {
    ReactDOM.unmountComponentAtNode(container);
    container.parentNode.removeChild(container);
    container = null;
  }
  Array.prototype.slice.call(document.querySelectorAll('.rbf-dropdown')).forEach(node => {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  });
});

/** Ancre simulée : un bouton à la position voulue. */
function anchorAt(rect) {
  const node = document.createElement('button');
  node.getBoundingClientRect = () => ({
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    right: rect.left + rect.width,
    bottom: rect.top + rect.height,
  });
  document.body.appendChild(node);
  return { current: node };
}

/**
 * Taille simulée du menu.
 *
 * `height` est la hauteur NATURELLE du contenu. On reproduit fidèlement le
 * navigateur : `offsetHeight` est écrêtée par le `max-height` déjà posé sur
 * l'élément, seul `scrollHeight` du conteneur interne rend la hauteur réelle.
 * C'est toute la difficulté — se fier à offsetHeight rend le débordement
 * invisible, et le menu ne se retourne jamais.
 */
function sizeDropdown(width, height) {
  const node = document.querySelector('.rbf-dropdown');
  if (!node) {
    return null;
  }
  const scroller = node.querySelector('.custom-scrollbar');
  const clamped = () => {
    const max = parseFloat(node.style.maxHeight);
    return isNaN(max) ? height : Math.min(height, max);
  };
  node.getBoundingClientRect = () => ({
    left: 0,
    top: 0,
    width,
    height: clamped(),
    right: width,
    bottom: clamped(),
  });
  Object.defineProperty(node, 'offsetWidth', { configurable: true, get: () => width });
  Object.defineProperty(node, 'offsetHeight', { configurable: true, get: clamped });
  Object.defineProperty(node, 'scrollHeight', { configurable: true, get: () => height });
  if (scroller) {
    Object.defineProperty(scroller, 'scrollHeight', { configurable: true, get: () => height });
    Object.defineProperty(scroller, 'offsetHeight', { configurable: true, get: clamped });
  }
  return node;
}

function renderDropdown(props) {
  ReactDOM.render(
    <Dropdown {...props}>
      <div style={{ width: 200, height: 150 }}>menu</div>
    </Dropdown>,
    container,
  );
  return document.querySelector('.rbf-dropdown');
}

const px = value => parseFloat(String(value).replace('px', ''));

describe('Dropdown — placement', () => {
  it('se positionne par rapport à la fenêtre, pas au document', () => {
    /* getBoundingClientRect rend des coordonnées relatives à la fenêtre.
       Avec `position: absolute` dans un portail accroché au body, le menu
       dérive de toute la hauteur défilée. */
    const anchor = anchorAt({ left: 840, top: 200, width: 40, height: 30 });
    const node = renderDropdown({ myRef: anchor, align: 'bottom-left' });
    expect(node.style.position).toBe('fixed');
  });

  it('aligne le bord gauche du menu sur celui de l\'ancre', () => {
    const anchor = anchorAt({ left: 300, top: 200, width: 40, height: 30 });
    const node = renderDropdown({ myRef: anchor, align: 'bottom-left' });
    expect(px(node.style.left)).toBe(300);
    expect(px(node.style.top)).toBe(230);
  });

  it('aligne le bord droit du menu sur celui de l\'ancre', () => {
    const anchor = anchorAt({ left: 840, top: 200, width: 40, height: 30 });
    const node = renderDropdown({ myRef: anchor, align: 'bottom-right' });
    /* Le bord droit du menu doit tomber sur le bord droit de l'ancre, soit
       880. En `right`, cela vaut 1280 - 880 = 400. */
    expect(px(node.style.right)).toBe(VIEWPORT.width - 880);
    expect(node.style.left).toBe('');
  });

  it('remonte le menu quand il déborderait sous la fenêtre', () => {
    const anchor = anchorAt({ left: 840, top: 700, width: 40, height: 30 });
    let node = renderDropdown({ myRef: anchor, align: 'bottom-right' });
    sizeDropdown(200, 300);
    window.dispatchEvent(new Event('resize'));
    node = document.querySelector('.rbf-dropdown');
    /* 700 + 30 + 300 = 1030 > 800 : le menu doit passer au-dessus de l'ancre,
       donc se terminer à 700 et commencer à 400. */
    expect(px(node.style.top)).toBe(400);
  });

  it('se retourne même quand max-height a déjà écrasé sa hauteur rendue', () => {
    /* Cas réel : l'ancre est en bas de page, il ne reste que 30 px dessous.
       Le menu reçoit donc un max-height de 22 px au premier calcul, et sa
       hauteur RENDUE devient 22 — mesurer offsetHeight ferait croire qu'il
       tient, et il resterait écrasé sous le bas de la page. */
    const anchor = anchorAt({ left: 700, top: 740, width: 60, height: 30 });
    renderDropdown({ myRef: anchor, align: 'bottom-right' });
    sizeDropdown(220, 300);
    window.dispatchEvent(new Event('resize'));
    const node = document.querySelector('.rbf-dropdown');
    expect(px(node.style.top)).toBe(740 - 300);
    expect(px(node.style.maxHeight)).toBeGreaterThanOrEqual(300);
  });

  it('colle le bas du menu retourné contre l\'ancre', () => {
    /* Retournement avec écrêtage : 170 px sous l'ancre, 600 au-dessus, menu de
       700. Il passe au-dessus, y est réduit à 592, et son BAS doit rester au
       contact du déclencheur — partir de la hauteur naturelle laisserait un
       trou de 108 px entre le menu et le bouton. */
    const anchor = anchorAt({ left: 700, top: 600, width: 60, height: 30 });
    renderDropdown({ myRef: anchor, align: 'bottom-right' });
    sizeDropdown(220, 700);
    window.dispatchEvent(new Event('resize'));
    const node = document.querySelector('.rbf-dropdown');
    const available = 600 - 8;
    expect(px(node.style.top)).toBe(600 - available);
    expect(px(node.style.top) + available).toBe(600);
  });

  it('reste en dessous quand la place y est plus grande, même sans y tenir', () => {
    /* 570 px sous l'ancre contre 200 au-dessus : se retourner réduirait la
       place. Le menu reste en dessous et défile. */
    const anchor = anchorAt({ left: 700, top: 200, width: 60, height: 30 });
    renderDropdown({ myRef: anchor, align: 'bottom-right' });
    sizeDropdown(220, 700);
    window.dispatchEvent(new Event('resize'));
    const node = document.querySelector('.rbf-dropdown');
    expect(px(node.style.top)).toBe(230);
    expect(px(node.style.maxHeight)).toBe(800 - 230 - 8);
  });

  it('ne sort pas par le haut si le menu est plus haut que la fenêtre', () => {
    const anchor = anchorAt({ left: 840, top: 700, width: 40, height: 30 });
    renderDropdown({ myRef: anchor, align: 'bottom-right' });
    sizeDropdown(200, 900);
    window.dispatchEvent(new Event('resize'));
    const node = document.querySelector('.rbf-dropdown');
    expect(px(node.style.top)).toBeGreaterThanOrEqual(0);
  });

  it('ramène le menu dans la fenêtre quand l\'ancre est près du bord droit', () => {
    const anchor = anchorAt({ left: 1260, top: 200, width: 20, height: 30 });
    renderDropdown({ myRef: anchor, align: 'bottom-left' });
    sizeDropdown(300, 150);
    window.dispatchEvent(new Event('resize'));
    const node = document.querySelector('.rbf-dropdown');
    /* 1260 + 300 dépasserait de 280 : le menu doit être ramené à 980. */
    expect(px(node.style.left)).toBeLessThanOrEqual(VIEWPORT.width - 300);
  });

  it('borne la hauteur du menu à l\'espace disponible', () => {
    const anchor = anchorAt({ left: 300, top: 400, width: 40, height: 30 });
    const node = renderDropdown({ myRef: anchor, align: 'bottom-left' });
    expect(node.style.maxHeight).not.toBe('');
    expect(node.style.maxHeight).not.toBe('auto');
  });
});

describe('computePlacement — cas limites', () => {
  const view = { width: 1000, height: 600 };
  const anchor = (left, top, width, height) => ({
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
  });

  it('ouvre vers le bas quand la place suffit', () => {
    const p = computePlacement(anchor(100, 100, 40, 30), { width: 200, height: 200 }, 'bottom-left', view);
    expect(p.top).toBe(130);
    expect(p.left).toBe(100);
  });

  it('reste vers le bas si la place manque aussi au-dessus', () => {
    /* Ancre tout en haut : remonter le menu ne servirait à rien, mieux vaut
       le laisser en dessous et le faire défiler. */
    const p = computePlacement(anchor(100, 10, 40, 30), { width: 200, height: 900 }, 'bottom-left', view);
    expect(p.top).toBe(40);
    expect(p.maxHeight).toBe(600 - 40 - 8);
  });

  it('tolère une ancre sans right ni bottom', () => {
    const p = computePlacement({ left: 100, top: 100, width: 40, height: 30 }, null, 'bottom-right', view);
    expect(p.top).toBe(130);
    expect(p.right).toBe(1000 - 140);
  });

  it('ne place jamais le menu hors de la fenêtre', () => {
    [
      anchor(-50, -50, 40, 30),
      anchor(2000, 2000, 40, 30),
      anchor(0, 599, 40, 30),
      anchor(999, 0, 40, 30),
    ].forEach(a => {
      ['bottom-left', 'bottom-right'].forEach(align => {
        const p = computePlacement(a, { width: 300, height: 250 }, align, view);
        expect(p.top).toBeGreaterThanOrEqual(8);
        expect(p.top).toBeLessThanOrEqual(view.height);
        const left = p.left !== undefined ? p.left : view.width - p.right - 300;
        expect(left).toBeGreaterThanOrEqual(8 - 300);
        expect(p.maxHeight).toBeGreaterThanOrEqual(0);
      });
    });
  });
});

describe('DropdownWrapper — ouverture', () => {
  it('s\'ouvre au clic sur son déclencheur et le reste', () => {
    const anchor = { current: null };
    ReactDOM.render(
      <DropdownWrapper trigger={<button className="trig">ouvrir</button>} myRef={anchor}>
        <div className="contenu">menu</div>
      </DropdownWrapper>,
      container,
    );
    const trigger = container.querySelector('.trig');
    trigger.getBoundingClientRect = () => ({ left: 300, top: 200, width: 40, height: 30, right: 340, bottom: 230 });
    trigger.click();
    expect(document.querySelector('.contenu')).not.toBeNull();
  });

  it('ne se referme pas au rendu suivant du parent', () => {
    /* La prop `open` était comparée à elle-même : elle est désormais une
       valeur initiale, reprise seulement quand l'appelant la change. */
    const anchor = { current: null };
    const tree = (
      <DropdownWrapper trigger={<button className="trig">ouvrir</button>} myRef={anchor}>
        <div className="contenu">menu</div>
      </DropdownWrapper>
    );
    ReactDOM.render(tree, container);
    const trigger = container.querySelector('.trig');
    trigger.getBoundingClientRect = () => ({ left: 300, top: 200, width: 40, height: 30, right: 340, bottom: 230 });
    trigger.click();
    ReactDOM.render(tree, container);
    expect(document.querySelector('.contenu')).not.toBeNull();
  });
});
