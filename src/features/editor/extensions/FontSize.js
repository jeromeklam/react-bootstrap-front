import { Extension } from '@tiptap/core';

/**
 * Taille de police.
 *
 * TipTap 2 ne fournit pas cette extension — `@tiptap/extension-font-size`
 * n'existe qu'à partir de la v3. Sans elle, toutes les tailles des contenus
 * déjà en base (`<span style="font-size:14px">`, écrit par l'ancien éditeur)
 * seraient silencieusement perdues à la première ouverture.
 *
 * L'attribut se greffe sur la marque `textStyle`, comme le font `Color` et
 * `FontFamily` : les trois se combinent alors dans un seul `<span>`.
 */
export const FontSize = Extension.create({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize || null,
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {};
              }
              return { style: 'font-size: ' + attributes.fontSize };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize: size => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize: size })
          .run();
      },
      unsetFontSize: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run();
      },
    };
  },
});

export default FontSize;
