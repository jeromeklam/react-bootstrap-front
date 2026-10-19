/**
 * Largeur du panneau droit de la page : bornée par une largeur minimale du
 * panneau et par la place qu'il faut laisser au contenu.
 */
export const maxRightPanelWidth = (windowWidth, sidebarWidth, contentMinWidth, minWidth) =>
  Math.max(minWidth, Math.floor(windowWidth - sidebarWidth - contentMinWidth));

export const clampRightPanelWidth = (width, minWidth, maxWidth) => {
  const value = Number.isFinite(width) ? width : minWidth;
  return Math.min(Math.max(Math.round(value), minWidth), Math.max(minWidth, maxWidth));
};
