# Éditeur HTML : feuille de route

Remplacement de l'éditeur draft-js (`src/features/draft`) par TipTap 2
(`src/features/editor`).

Les commits de septembre 2026 sont numérotés « phase n/8 », mais aucun plan écrit
ne détaille les phases 6 à 8. **Cette page fait foi** pour ce qui reste à faire.

## Fait : version 3.11.0

| Étape | Commit | Contenu |
|---|---|---|
| 1 | `36b9ce8` | Noyau de nettoyage : `cleanHtml` (profils LOAD, PASTE, STRICT), `normalizeLegacyHtml`, `serialize` |
| 2 | `ccfbef6` | Composant `HtmlEditor`, contrat d'appel identique à l'ancien `InputHtml` |
| 3 | `69d7e68` | Barre d'outils, dialogues lien, image et variables, vue source |
| 4-5 | `1178cbc` | Tests de montage, aperçu autonome `demo/`, `sync-to.sh` |
| | `abd989f`, `8e4d49c` | Placement des menus déroulants, dont profite la barre d'outils |

Première application intégrée : l'administration Kalaweit (dépôt `admin`, commit
`a5dc76a`).

## Reste à faire

1. **Publier la 3.11.0 sur npm.** Une application ne doit jamais dépendre d'une copie
   manuelle : `sync-to.sh` sert au développement, pas à la livraison.
2. **Valider en production**, avec l'administration Kalaweit 2.23.1.
3. **Version 4.0.0**, une fois la validation faite :
   - supprimer `src/features/draft` et son `export *` dans `src/index.js` ;
   - retirer les dépendances `draft-js`, `draft-convert`, `html-to-draftjs`,
     `react-draft-wysiwyg` et `@draft-js-plugins/image`, qui ne servent nulle part
     ailleurs ;
   - ré-exporter `HtmlEditor` sous le nom `InputHtml`, voir
     `src/features/editor/index.js` ;
   - le bundle doit repasser sous sa taille d'avant TipTap, environ 300 Ko de moins.
4. **Quand le catalogue des variables de fusion viendra de l'API**, activer
   `strictMergeVars` dans les applications, pour signaler les variables inconnues.
