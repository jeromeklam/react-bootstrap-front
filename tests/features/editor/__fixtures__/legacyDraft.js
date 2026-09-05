/**
 * Contenu tel que l'ancien éditeur draft-js l'a écrit en base.
 * Chaque tournure ici correspond à une branche de `toHtml` dans
 * src/features/draft/InputHtml.js : c'est la spécification de l'existant.
 */
export const LEGACY_DRAFT = [
  '<p>[[:head_group.notification_main_header:]]</p>',
  '<br/>',
  '<p><strong>Chèr(e) <span data-mailmerge="{originalText}">[[:client.cli_fullname:]]</span>,</strong></p>',
  '<p><span style="font-size:14px">Nous espérons que vous avez passé de bonnes fêtes.</span></p>',
  '<p><span style="color:#c00000">Merci</span> pour <cite>votre soutien</cite>.</p>',
  '<p><span style="text-align:center">Ligne centrée</span></p>',
  '<p><u>Souligné</u>, <s>barré</s>, x<sup>2</sup>, x<sub>2</sub>.</p>',
  '<p><a href="https://kalaweit.org">Notre site</a></p>',
  '<img src="https://kalaweit.org/photo.jpg" height="120" width="200" alt=""/>',
].join('');

/**
 * Le même contenu, une fois converti par un aller-retour dans l'éditeur.
 * Sert de référence de lecture, pas d'assertion stricte.
 */
export const LEGACY_DRAFT_TEXT =
  '[[:head_group.notification_main_header:]]' +
  'Chèr(e) [[:client.cli_fullname:]],' +
  'Nous espérons que vous avez passé de bonnes fêtes.' +
  'Merci pour votre soutien.' +
  'Ligne centrée' +
  'Souligné, barré, x2, x2.' +
  'Notre site';
