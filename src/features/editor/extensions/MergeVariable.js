import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

/**
 * Mise en évidence des variables de fusion `[[:objet.champ:]]`.
 *
 * Le choix structurant : ce sont de simples **décorations**, pas des nœuds ni
 * des marques. Le HTML stocké reste donc rigoureusement identique à celui
 * qu'écrivait l'ancien éditeur — le backend PHP continue son `str_replace`,
 * aucune migration de données, aucun changement côté serveur.
 *
 * L'apport réel est la variante « inconnue » : un `[[:cli.fullname:]]` mal
 * orthographié se voit à la frappe, alors qu'aujourd'hui l'erreur ne se
 * découvre qu'à l'envoi du courriel.
 */
export const MERGE_VARIABLE_PATTERN = /\[\[:([a-zA-Z0-9_.\-]+):\]\]/g;

function buildDecorations(doc, knownCodes) {
  const decorations = [];
  doc.descendants((node, pos) => {
    if (!node.isText || !node.text) {
      return;
    }
    MERGE_VARIABLE_PATTERN.lastIndex = 0;
    let match = MERGE_VARIABLE_PATTERN.exec(node.text);
    while (match !== null) {
      const known = !knownCodes || knownCodes.indexOf(match[0]) !== -1;
      decorations.push(
        Decoration.inline(pos + match.index, pos + match.index + match[0].length, {
          class: known ? 'rbf-mergevar' : 'rbf-mergevar rbf-mergevar-unknown',
          title: match[1],
        }),
      );
      match = MERGE_VARIABLE_PATTERN.exec(node.text);
    }
  });
  return DecorationSet.create(doc, decorations);
}

export const MergeVariable = Extension.create({
  name: 'mergeVariable',

  addOptions() {
    return {
      /** Liste plate des codes connus, ou null pour ne rien signaler comme inconnu. */
      knownCodes: null,
    };
  },

  addProseMirrorPlugins() {
    const knownCodes = this.options.knownCodes;
    const key = new PluginKey('mergeVariable');
    return [
      new Plugin({
        key,
        state: {
          init(config, state) {
            return buildDecorations(state.doc, knownCodes);
          },
          apply(transaction, previous) {
            return transaction.docChanged ? buildDecorations(transaction.doc, knownCodes) : previous;
          },
        },
        props: {
          decorations(state) {
            return key.getState(state);
          },
        },
      }),
    ];
  },
});

/**
 * Aplatit une structure `mergeVars` groupée en simple liste de codes.
 * Tolère l'ancien format plat `[{ text_code, text_content }]` de `presetTexts`.
 */
export function collectMergeCodes(mergeVars) {
  if (!mergeVars || !Array.isArray(mergeVars) || mergeVars.length === 0) {
    return null;
  }
  const codes = [];
  for (let i = 0; i < mergeVars.length; i++) {
    const entry = mergeVars[i];
    if (!entry) {
      continue;
    }
    if (Array.isArray(entry.items)) {
      for (let j = 0; j < entry.items.length; j++) {
        if (entry.items[j] && entry.items[j].code) {
          codes.push(entry.items[j].code);
        }
      }
    } else if (entry.code) {
      codes.push(entry.code);
    } else if (entry.text_code) {
      codes.push(entry.text_code);
    }
  }
  return codes.length > 0 ? codes : null;
}

export default MergeVariable;
