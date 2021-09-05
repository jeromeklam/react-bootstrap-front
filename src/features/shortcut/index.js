/**
 * Shortcut visible ?
 * 
 * @param {Array} shortcuts
 * @param {String} name
 */ 
export const shortcutIsVisible = (shortcuts, name) => {
  const myShortcut = shortcuts.find(elem => elem.name === name);
  return myShortcut && myShortcut.display === 'block' ? true : false; 
}

/**
 * Shortcut minimized ?
 * 
 * @param {Array} shortcuts
 * @param {String} name
 */ 
export const shortcutIsMinimized = (shortcuts, name) => {
  const myShortcut = shortcuts.find(elem => elem.name === name);
  return myShortcut && myShortcut.size === 'minimized' ? true : false; 
}

/**
 * Shortcut maximized ?
 * 
 * @param {Array} shortcuts
 * @param {String} name
 */ 
export const shortcutIsMaximized = (shortcuts, name) => {
  const myShortcut = shortcuts.find(elem => elem.name === name);
  return myShortcut && myShortcut.size === 'maximized' ? true : false; 
}

export { default as ShortcutBar } from './ShortcutBar.jsx';
export { default as Shortcut } from './Shortcut.jsx';