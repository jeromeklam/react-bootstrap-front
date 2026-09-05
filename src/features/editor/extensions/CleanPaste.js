import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { cleanHtml } from '../html/cleanHtml';

/**
 * Nettoyage automatique du collage.
 *
 * C'est la vraie réponse au « je dois souvent nettoyer des spans, couleur,
 * font, taille inutiles » : le HTML de Word, d'Outlook ou de Google Docs
 * n'entre jamais dans le document. Rien à cliquer, rien à penser.
 *
 * Le profil PASTE conserve la mise en forme voulue (couleurs, tailles
 * explicites) et ne retire que le bruit. Le bouton « Nettoyer » reste là pour
 * aller plus loin à la demande.
 */
export const CleanPaste = Extension.create({
  name: 'cleanPaste',

  addOptions() {
    return {
      enabled: true,
      profile: 'paste',
    };
  },

  addProseMirrorPlugins() {
    const { enabled, profile } = this.options;
    if (!enabled) {
      return [];
    }
    return [
      new Plugin({
        key: new PluginKey('cleanPaste'),
        props: {
          transformPastedHTML(html) {
            return cleanHtml(html, profile);
          },
        },
      }),
    ];
  },
});

export default CleanPaste;
