import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { FontSize, LegacyImageAttrs, CleanPaste, MergeVariable, collectMergeCodes } from './extensions';

/**
 * Jeu d'extensions de l'éditeur.
 *
 * Le schéma est délibérément restreint à ce que tolère un client de messagerie
 * ancien : p, h1-h3, strong, em, u, s, sub, sup, a, ul, ol, li, blockquote, hr,
 * img, br et span[style]. Ni `<pre>` ni `<code>` : ils ne servent à rien dans
 * un courriel et produisent une mise en forme que les clients ignorent.
 */
export function buildExtensions(props) {
  const options = props || {};
  return [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
      codeBlock: false,
      code: false,
      history: { depth: 100 },
      dropcursor: { width: 2 },
    }),
    Underline,
    Subscript,
    Superscript,
    /* TextStyle porte color, font-family et font-size : les trois attributs se
       combinent dans un seul <span>, au lieu de trois imbriqués. */
    TextStyle,
    Color,
    FontFamily.configure({ types: ['textStyle'] }),
    FontSize,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      alignments: ['left', 'center', 'right', 'justify'],
    }),
    /* target et rel explicitement à null, et non un objet vide : les options
       sont FUSIONNÉES avec les défauts de l'extension, qui posent
       target="_blank" rel="noopener noreferrer nofollow" sur tout lien. Un
       objet vide laisserait donc ces défauts réécrire l'intégralité des liens
       de la base au premier enregistrement. La cible se choisit dans la boîte
       de dialogue, lien par lien. */
    Link.configure({
      openOnClick: false,
      autolink: true,
      linkOnPaste: true,
      HTMLAttributes: { target: null, rel: null, class: null },
    }),
    Image.configure({
      inline: false,
      allowBase64: true,
    }),
    LegacyImageAttrs,
    Placeholder.configure({ placeholder: options.placeholder || '' }),
    /* knownCodes n'est renseigné qu'en mode strict : tant que le catalogue est
       tenu à la main côté application, il est forcément incomplet, et signaler
       en rouge une variable parfaitement valide serait pire qu'inutile. À
       basculer le jour où le catalogue vient de l'API et fait autorité. */
    MergeVariable.configure({
      knownCodes: options.strictMergeVars ? collectMergeCodes(options.mergeVars) : null,
    }),
    CleanPaste.configure({
      enabled: options.cleanOnPaste !== false,
      profile: options.pasteProfile || 'paste',
    }),
  ];
}

export default buildExtensions;
