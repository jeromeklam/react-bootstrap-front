import { Extension } from '@tiptap/core';

/**
 * Dimensions des images.
 *
 * `@tiptap/extension-image` ne relit ni `width` ni `height` : une image de la
 * base écrite `<img src="…" height="120" width="200">` ressortirait sans ses
 * dimensions et casserait la mise en page du courriel.
 *
 * Les attributs sont volontairement rendus en attributs HTML et non en style :
 * c'est la seule forme que comprennent les clients de messagerie anciens.
 */
export const LegacyImageAttrs = Extension.create({
  name: 'legacyImageAttrs',

  addOptions() {
    return {
      types: ['image'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          width: {
            default: null,
            parseHTML: element => element.getAttribute('width') || null,
            renderHTML: attributes => (attributes.width ? { width: attributes.width } : {}),
          },
          height: {
            default: null,
            parseHTML: element => element.getAttribute('height') || null,
            renderHTML: attributes => (attributes.height ? { height: attributes.height } : {}),
          },
        },
      },
    ];
  },
});

export default LegacyImageAttrs;
