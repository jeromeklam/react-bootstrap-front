/**
 * Éditeur HTML (TipTap 2).
 *
 * `InputHtml` n'est volontairement PAS ré-exporté ici tant que
 * `features/draft` existe : deux `export *` portant le même nom produisent un
 * « ambiguous star export », résolu silencieusement en `undefined`.
 * L'alias sera ajouté en 4.0.0, à la suppression de draft-js.
 */
export { default as HtmlEditor } from './HtmlEditor';
export { default as EditorToolbar } from './Toolbar';
export { default as EditorToolbarButton } from './ToolbarButton';
export { default as EditorSourceView } from './SourceView';
export { default as EditorLinkDialog } from './LinkDialog';
export { default as EditorImageDialog } from './ImageDialog';
export { default as EditorMergeMenu, normalizeMergeVars } from './MergeMenu';
export { defaultIcons as editorDefaultIcons } from './defaultIcons';
export { buildExtensions } from './buildExtensions';
export * from './toolbarPresets';
export * from './html';
export * from './extensions';
