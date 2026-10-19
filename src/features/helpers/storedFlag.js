/**
 * Un booléen mémorisé par l'application dans localStorage (une rangée d'outils
 * dépliée, un tiroir agrandi…). Silencieux si le stockage est absent ou refusé.
 */
export const readStoredFlag = (key, fallback = false) => {
  if (!key) {
    return fallback;
  }
  try {
    const value = window.localStorage.getItem(key);
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

export const writeStoredFlag = (key, value) => {
  if (!key) {
    return;
  }
  try {
    window.localStorage.setItem(key, value ? '1' : '0');
  } catch (error) {
    /* pas de stockage : le choix ne survit pas au rechargement */
  }
};

/* Même chose pour un nombre (une largeur de panneau). */
export const readStoredNumber = (key, fallback) => {
  if (!key) {
    return fallback;
  }
  try {
    const value = parseInt(window.localStorage.getItem(key), 10);
    if (!Number.isNaN(value)) {
      return value;
    }
  } catch (error) {
    /* pas de stockage : on garde la valeur par défaut */
  }
  return fallback;
};

export const writeStoredNumber = (key, value) => {
  if (!key) {
    return;
  }
  try {
    window.localStorage.setItem(key, String(Math.round(value)));
  } catch (error) {
    /* pas de stockage : le choix ne survit pas au rechargement */
  }
};
