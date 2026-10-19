/**
 * Mémorise si la rangée d'outils d'une liste (ses critères de recherche) est
 * affichée. Par liste, dans localStorage ; silencieux si le stockage est absent ou
 * refusé (navigation privée).
 */
const KEY = 'rbf.list.toolbar.';

export const readToolbarOpen = (storageKey, fallback = false) => {
  if (!storageKey) {
    return fallback;
  }
  try {
    const value = window.localStorage.getItem(KEY + storageKey);
    if (value === '1') {
      return true;
    }
    if (value === '0') {
      return false;
    }
  } catch (error) {
    /* pas de stockage : on garde la valeur par défaut */
  }
  return fallback;
};

export const writeToolbarOpen = (storageKey, open) => {
  if (!storageKey) {
    return;
  }
  try {
    window.localStorage.setItem(KEY + storageKey, open ? '1' : '0');
  } catch (error) {
    /* pas de stockage : le choix ne survit pas au rechargement */
  }
};
