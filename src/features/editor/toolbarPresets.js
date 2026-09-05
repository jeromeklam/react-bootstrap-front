/**
 * Configurations de barre d'outils.
 *
 * Un preset est une liste de groupes, chaque groupe une liste de clés de
 * boutons. L'application peut moduler par formulaire : un champ de traduction
 * ou d'alerte n'a pas besoin de la même barre qu'un gabarit de courriel.
 */
export const TOOLBAR_PRESETS = {
  full: [
    ['undo', 'redo'],
    ['paragraph', 'heading1', 'heading2', 'heading3'],
    ['bold', 'italic', 'underline', 'strike', 'subscript', 'superscript'],
    ['bulletList', 'orderedList', 'blockquote'],
    ['alignLeft', 'alignCenter', 'alignRight', 'alignJustify'],
    ['color', 'fontSize', 'fontFamily'],
    ['link', 'unlink', 'image'],
    ['mergeVar'],
    ['clean', 'formatClear'],
    ['source'],
  ],
  email: [
    ['undo', 'redo'],
    ['paragraph', 'heading1', 'heading2', 'heading3'],
    ['bold', 'italic', 'underline', 'strike'],
    ['bulletList', 'orderedList'],
    ['alignLeft', 'alignCenter', 'alignRight'],
    ['color', 'fontSize'],
    ['link', 'unlink', 'image'],
    ['mergeVar'],
    ['clean', 'formatClear'],
    ['source'],
  ],
  simple: [['bold', 'italic', 'underline'], ['bulletList', 'orderedList'], ['link'], ['clean']],
  minimal: [['bold', 'italic'], ['clean']],
};

/** Groupes rebasculés dans le menu « … » sur petit écran. */
export const OPTIONAL_KEYS = ['color', 'fontSize', 'fontFamily', 'alignJustify', 'blockquote', 'horizontalRule'];

export const FONT_SIZES = ['8px', '10px', '11px', '12px', '14px', '16px', '18px', '24px', '30px', '36px', '48px'];

export const FONT_FAMILIES = ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'];

/**
 * Palette volontairement courte : dans un courriel, une charte tient en une
 * poignée de couleurs, et un nuancier complet invite à la faute de goût.
 */
export const COLORS = [
  '#000000',
  '#434343',
  '#666666',
  '#999999',
  '#b7b7b7',
  '#ffffff',
  '#980000',
  '#ff0000',
  '#ff9900',
  '#ffff00',
  '#00ff00',
  '#00ffff',
  '#4a86e8',
  '#0000ff',
  '#9900ff',
  '#ff00ff',
  '#83ad10',
  '#235b8b',
];

export function resolveToolbarConfig(preset, config) {
  if (Array.isArray(config)) {
    return config;
  }
  return TOOLBAR_PRESETS[preset] || TOOLBAR_PRESETS.full;
}
