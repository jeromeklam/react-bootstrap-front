/** Marge minimale conservée entre le menu et le bord de la fenêtre. */
export const DROPDOWN_MARGIN = 8;

/**
 * Calcule la position d'un menu déroulant.
 *
 * Fonction pure, volontairement séparée du composant : c'est la seule partie
 * délicate, et elle se teste sans DOM.
 *
 * Les coordonnées de l'ancre viennent de `getBoundingClientRect()`, donc
 * relatives à la FENÊTRE. Le menu doit être positionné en `fixed`, sinon il
 * dérive de toute la hauteur défilée.
 *
 * @param {object} anchor   { left, top, width, height, right, bottom }
 * @param {object} menu     { width, height } — 0 tant que le menu n'est pas mesuré
 * @param {string} align    'bottom-right' aligne les bords droits, sinon les gauches
 * @param {object} viewport { width, height }
 * @param {number} margin
 * @returns {object} style partiel : top, plus left ou right, plus maxHeight
 */
export function computePlacement(anchor, menu, align, viewport, margin = DROPDOWN_MARGIN) {
  const menuWidth = (menu && menu.width) || 0;
  const menuHeight = (menu && menu.height) || 0;
  const anchorRight = anchor.right !== undefined ? anchor.right : anchor.left + anchor.width;
  const anchorBottom = anchor.bottom !== undefined ? anchor.bottom : anchor.top + anchor.height;

  const spaceBelow = viewport.height - anchorBottom;
  const spaceAbove = anchor.top;

  /* Le menu s'ouvre vers le bas, sauf s'il n'y tient pas et qu'il y a
     davantage de place au-dessus.
     `menuHeight` doit être la hauteur NATURELLE du contenu : la hauteur rendue
     est déjà écrêtée par le max-height posé au calcul précédent, et s'y fier
     rendrait tout débordement invisible. */
  const flip = menuHeight > 0 && spaceBelow < menuHeight + margin && spaceAbove > spaceBelow;
  const available = Math.max(0, (flip ? spaceAbove : spaceBelow) - margin);
  const effectiveHeight = menuHeight > 0 ? Math.min(menuHeight, available) : 0;

  /* Retourné, c'est le BAS du menu qui se cale sur le déclencheur : partir de
     la hauteur naturelle laisserait un trou dès que le menu est écrêté. */
  let top = flip ? anchor.top - effectiveHeight : anchorBottom;
  top = Math.min(top, viewport.height - margin - effectiveHeight);
  top = Math.max(margin, top);

  const placement = { top: top, maxHeight: available };

  if (align === 'bottom-right') {
    /* Bords droits alignés. En `right`, cela vaut la distance entre le bord
       droit de la fenêtre et celui de l'ancre. */
    let right = viewport.width - anchorRight;
    if (menuWidth > 0) {
      /* Ne pas déborder par la gauche. */
      right = Math.min(right, viewport.width - menuWidth - margin);
    }
    placement.right = Math.max(margin, right);
  } else {
    let left = anchor.left;
    if (menuWidth > 0) {
      left = Math.min(left, viewport.width - menuWidth - margin);
    }
    placement.left = Math.max(margin, left);
  }
  return placement;
}

export default computePlacement;
