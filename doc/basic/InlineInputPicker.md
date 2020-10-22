## InlineInputPicker

Champ de saisie avec sélection dans une liste de résultats à l'intérieur d'une ligne de saisie.

### Props

#### Obligatoires

| Nom       | Type     | Commentaire                                   |
| --------- | -------- | --------------------------------------------- |
| name      | Chaine   | Le nom du champ, en snakeCase si possible     |
| label     | Chaine   | Le libellé du champ                           |
| list      | Element  | Liste de résultats trouvée avec la saisie     |
| onClear   | Fonction | Action qui vide le champ                      |
| onMore    | Fonction | Action qui ouvre la fenêtre de recherche      |
| onChange  | Fonction | onChange(event)                               |
| onSelect  | Fonction | Pour remplir le champ avec une valeur trouvée |
| clearIcon | Element  | Pour vider le champ                           |
| moreIcon  | Element  | Pour rechercher un élément                    |

#### Optionnels

| Nom           | Type    | Remarque | Commentaire                                                          |
| ------------- | ------- | -------- | -------------------------------------------------------------------- |
| value         | Chaine  | ''       | La valeur                                                            |
| required      | Booléen | Faux     | Pour rendre le champ obligatoire                                     |
| labelTop      | Booléen | Vrai     | Le libellé s'affiche au dessus du champ                              |
| size          | Taille  |          | Pour changer la taille par défaut                                    |
| inputSize     | Taille  | 36       | Taille du champ de saisie                                            |
| error         | Element | Faux     | Gestion du champ en erreur                                           |
| display       | Chaine  | ''       | Chaine cherchée                                                      |
| pickerId      | Chaine  | ''       | Nom de l'identifiant de la table dans laquelle on effectue lacherche |
| pickerDisplay | Chaine  | ''       | Liste des champs (séparés par une virgule) à afficher                |

#### Fonctions appelées

| Nom      | Type     | Remarque | Commentaire                                             |
| -------- | -------- | -------- | ------------------------------------------------------- |
| onClear  | Fonction | Obl.     | Action qui vide le champ                                |
| onMore   | Fonction | Obl.     | Action qui ouvre la fenêtre de recherche                |
| onChange | Fonction | Obl.     | onChange(event)                                         |
| onSelect | Fonction | Obl.     | Pour remplir le champ avec une valeur trouvée           |

### Spécificités

- Si 'error' est renseigné, le champ sera invalide ![](./is_invalid.png) et
  l'élement erreur anomalie sera ajouté après
  (le plus souvent celà sera un message d'erreur en dessous)    
- 2 fonctionnements :
  - Soit on saisit une valeur et si des éléments correspondent,
  une liste s'ouvre dans laquelle on peut sélectionné l'élement voulu
  - Soit, on clique directement sur le bouton recherche (onMore) qui ouvre une fenêtre
  qu'il faut avoir créée avec des champs de recherche qui donne aussi une liste de résultats
-Pas de zoom ni de création à la volée

### Exemple

Exemple non trouvé
