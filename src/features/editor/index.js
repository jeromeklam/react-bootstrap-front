/**
 * Éditeur HTML (TipTap 2).
 *
 * `InputHtml` n'est volontairement PAS ré-exporté ici tant que
 * `features/draft` existe : deux `export *` portant le même nom produisent un
 * « ambiguous star export », résolu silencieusement en `undefined`.
 * L'alias sera ajouté en 4.0.0, à la suppression de draft-js.
 */
export { default as HtmlEditor } from './HtmlEditor';
export { buildExtensions } from './buildExtensions';
export * from './html';
export * from './extensions';
