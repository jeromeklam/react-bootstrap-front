import fs from 'fs';
import path from 'path';

/**
 * Le bundle publié doit rester lisible par webpack 4.
 *
 * L'application qui consomme cette librairie est bâtie sur webpack 4, dont
 * l'analyseur est acorn 6 : il ne connaît ni l'opérateur `?.` ni `??`. Une
 * montée de version d'une dépendance (TipTap, ProseMirror…) qui réintroduirait
 * cette syntaxe casserait le build de l'application sans prévenir ici.
 *
 * Ce test ferme le sujet définitivement : il analyse le dist réellement produit
 * avec l'analyseur réellement utilisé en aval.
 */
const DIST = path.resolve(__dirname, '..', 'dist', 'react-bootstrap-front.js');

const describeIfBuilt = fs.existsSync(DIST) ? describe : describe.skip;

describeIfBuilt('dist', () => {
  it('parse en ecmaVersion 2019, la limite de webpack 4', () => {
    /* eslint-disable global-require */
    const acorn = require('webpack/node_modules/acorn');
    /* eslint-enable global-require */
    expect(acorn.version.indexOf('6.')).toBe(0);
    const source = fs.readFileSync(DIST, 'utf8');
    expect(() => acorn.parse(source, { ecmaVersion: 2019 })).not.toThrow();
  });
});
