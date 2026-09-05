#!/usr/bin/env bash
#
# Construit la librairie et recopie le résultat dans les node_modules d'une
# application, pour la tester sans publier.
#
#   ./sync-to.sh ~/GitHub/admin
#
# Pourquoi pas `npm link` : le lien remplace tout le paquet par un lien
# symbolique, ce qui fait disparaître ses dépendances des node_modules de
# l'application. Or plusieurs applications importent `classnames`,
# `prop-types` ou `lodash` sans les déclarer, en comptant sur la remontée
# depuis cette librairie — le lien casse alors leur build. La copie, elle,
# laisse l'arbre de dépendances intact.
#
# Sont recopiés :
#   dist/  le bundle réellement exécuté (main du package.json)
#   src/   consommé par la chaîne SCSS de l'application

set -euo pipefail

TARGET="${1:-}"
if [ -z "$TARGET" ]; then
  echo "usage : $0 <chemin de l'application>" >&2
  exit 1
fi

DEST="$TARGET/node_modules/react-bootstrap-front"
if [ ! -d "$DEST" ]; then
  echo "react-bootstrap-front n'est pas installé dans $TARGET" >&2
  exit 1
fi
if [ -L "$DEST" ]; then
  echo "$DEST est un lien symbolique : défaites le npm link d'abord" >&2
  exit 1
fi

HERE="$(cd "$(dirname "$0")" && pwd)"
cd "$HERE"

npm run build

rsync -a --delete "$HERE/dist/" "$DEST/dist/"
rsync -a --delete "$HERE/src/" "$DEST/src/"
cp "$HERE/package.json" "$DEST/package.json.rbf-source"

echo "Synchronisé vers $DEST"
