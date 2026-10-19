/**
 * Prépare les aperçus autonomes : le champ HTML (index.html) et les composants
 * de recherche (recherche.html).
 *
 *   node demo/build.js [chemin de l'application]     (défaut : ../admin)
 *   puis ouvrir demo/index.html ou demo/recherche.html dans un navigateur.
 *
 * L'aperçu utilise le bundle réellement publié (`dist/`), les styles réellement
 * compilés par l'application, et les mêmes icônes Material Design — de façon à
 * montrer ce que verra l'utilisateur, pas une approximation.
 *
 * Les fichiers produits ne sont pas versionnés : ils pèsent plusieurs mégaoctets
 * et se régénèrent en une commande.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const DEMO = __dirname;
const LIB = path.resolve(DEMO, '..');
const APP = path.resolve(process.argv[2] || path.join(LIB, '..', 'admin'));

if (!fs.existsSync(path.join(APP, 'package.json'))) {
  console.error('Application introuvable : ' + APP);
  process.exit(1);
}

/* Mêmes glyphes que src/features/ui/editorIcons.js côté application. */
const MAP = {
  bold: 'mdiFormatBold',
  italic: 'mdiFormatItalic',
  underline: 'mdiFormatUnderline',
  strike: 'mdiFormatStrikethroughVariant',
  subscript: 'mdiFormatSubscript',
  superscript: 'mdiFormatSuperscript',
  paragraph: 'mdiFormatParagraph',
  heading1: 'mdiFormatHeader1',
  heading2: 'mdiFormatHeader2',
  heading3: 'mdiFormatHeader3',
  bulletList: 'mdiFormatListBulleted',
  orderedList: 'mdiFormatListNumbered',
  blockquote: 'mdiFormatQuoteClose',
  horizontalRule: 'mdiMinus',
  alignLeft: 'mdiFormatAlignLeft',
  alignCenter: 'mdiFormatAlignCenter',
  alignRight: 'mdiFormatAlignRight',
  alignJustify: 'mdiFormatAlignJustify',
  color: 'mdiFormatColorText',
  fontSize: 'mdiFormatSize',
  fontFamily: 'mdiFormatFont',
  link: 'mdiLinkVariant',
  unlink: 'mdiLinkOff',
  image: 'mdiImage',
  mergeVar: 'mdiVariable',
  clean: 'mdiBroom',
  formatClear: 'mdiFormatClear',
  source: 'mdiCodeTags',
  undo: 'mdiUndo',
  redo: 'mdiRedo',
  more: 'mdiDotsHorizontal',
  toolbar: 'mdiTools',
  clear: 'mdiDelete',
  /* Recherche (recherche.html). */
  sparkle: 'mdiCreation',
  caret: 'mdiChevronDown',
  close: 'mdiClose',
  check: 'mdiCheck',
  plus: 'mdiPlus',
  calendar: 'mdiCalendar',
  tune: 'mdiTune',
};

const mdi = require(path.join(APP, 'node_modules/@mdi/js'));
const paths = {};
Object.keys(MAP).forEach(key => {
  if (typeof mdi[MAP[key]] !== 'string') {
    throw new Error('glyphe absent de @mdi/js : ' + MAP[key]);
  }
  paths[key] = mdi[MAP[key]];
});
fs.writeFileSync(path.join(DEMO, 'icons.js'), 'window.DEMO_ICON_PATHS = ' + JSON.stringify(paths, null, 2) + ';\n');

['react/umd/react.development.js', 'react-dom/umd/react-dom.development.js'].forEach(rel => {
  fs.copyFileSync(path.join(APP, 'node_modules', rel), path.join(DEMO, path.basename(rel)));
});

const CSS = path.join(DEMO, 'app.css');
execFileSync(
  'npx',
  ['sass', '--no-source-map', '--load-path=node_modules', 'src/styles/index.scss', CSS],
  { cwd: APP, stdio: 'inherit' },
);

/* sass laisse tels quels les @import de fichiers .css (react-datepicker, grille…),
   que seul webpack résout dans l'application. Ouverte en file://, la page ne les
   trouverait pas : le calendrier s'affichait sans style. On les inline. */
const inlined = fs.readFileSync(CSS, 'utf8').replace(/@import\s+(?:url\()?["']([^"')]+)["']\)?\s*;/g, (line, target) => {
  const file = target.startsWith('~')
    ? path.join(APP, 'node_modules', target.slice(1))
    : path.resolve(APP, 'src/styles', target);
  if (!fs.existsSync(file)) {
    console.warn('feuille importée introuvable, laissée telle quelle : ' + target);
    return line;
  }
  return '/* ' + target + ' */\n' + fs.readFileSync(file, 'utf8');
});
fs.writeFileSync(CSS, inlined);

console.log('Aperçus prêts : ouvrez ' + path.join(DEMO, 'index.html') + ' ou ' + path.join(DEMO, 'recherche.html'));
