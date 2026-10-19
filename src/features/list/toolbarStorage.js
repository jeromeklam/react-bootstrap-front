import { readStoredFlag, writeStoredFlag } from '../helpers/storedFlag';

/**
 * Mémorise si la rangée d'outils d'une liste (ses critères de recherche) est
 * affichée. Par liste, dans localStorage.
 */
const KEY = 'rbf.list.toolbar.';

export const readToolbarOpen = (storageKey, fallback = false) => readStoredFlag(storageKey ? KEY + storageKey : null, fallback);

export const writeToolbarOpen = (storageKey, open) => writeStoredFlag(storageKey ? KEY + storageKey : null, open);
