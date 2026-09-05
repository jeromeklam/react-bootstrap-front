import React from 'react';

/**
 * Repli textuel des icônes de la barre d'outils.
 *
 * La librairie ne dépend d'aucune bibliothèque d'icônes : l'application
 * fournit les siennes via la prop `icons`, un objet plat de nœuds React —
 * le motif déjà employé partout ici (`clearIcon`, `toolbarIcon`, `sortUpIcon`…).
 * Ce repli garantit qu'un éditeur reste utilisable même sans icônes fournies.
 */
export const defaultIcons = {
  bold: <b>B</b>,
  italic: <i>I</i>,
  underline: <u>U</u>,
  strike: <s>S</s>,
  subscript: <span>x₂</span>,
  superscript: <span>x²</span>,
  paragraph: <span>¶</span>,
  heading1: <span>H1</span>,
  heading2: <span>H2</span>,
  heading3: <span>H3</span>,
  bulletList: <span>•</span>,
  orderedList: <span>1.</span>,
  blockquote: <span>❝</span>,
  horizontalRule: <span>―</span>,
  alignLeft: <span>⇤</span>,
  alignCenter: <span>↔</span>,
  alignRight: <span>⇥</span>,
  alignJustify: <span>≡</span>,
  color: <span>A</span>,
  fontSize: <span>Aa</span>,
  fontFamily: <span>F</span>,
  link: <span>↗</span>,
  unlink: <span>⊘</span>,
  image: <span>▣</span>,
  mergeVar: <span>{'{ }'}</span>,
  clean: <span>≀</span>,
  formatClear: <span>Ø</span>,
  source: <span>{'</>'}</span>,
  undo: <span>↶</span>,
  redo: <span>↷</span>,
  more: <span>…</span>,
};

export default defaultIcons;
