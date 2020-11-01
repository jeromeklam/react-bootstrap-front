## InputCheckLists

Listes de cases à cocher avec saisie de libellé pour chaque case.

### Props

#### Obligatoires

| Nom               | Type     | Commentaire                               |
| ----------------- | -------- | ----------------------------------------- |
| name              | Chaine   | Le nom du champ, en snakeCase si possible |
| onChange          | Fonction | onChange(event)                           |
| addlLineIcon      | Element  | Icone pour ajouter une case à cocher      |
| delLineIcon       | Element  | Icone pour supprimer une case à cocher    |
| checkedLineIcon   | Element  | Icone case cochée                         |
| uncheckedLineIcon | Element  | Icone case décochée                       |

#### Optionnels

| Nom                  | Type    | Remarque | Commentaire                                                   |
| -------------------- | ------- | -------- | ------------------------------------------------------------- |
| value                | String  |          | Contenu liste plus cases avec options en format Json          |
| checkedLine          | String  |          | Style pour le libellé d'une case cochée (barrée)              |
| delIcon              | Element |          | Icone pour supprimer une liste                                |
| addLineIcon          | Element |          | Icone pour ajouter une case à cocher en mode multi-listes     |
| openLinesIcon        | Element |          | Icone pour ouvrir la liste des cases à cocher                 |
| closeLinesIcon       | Element |          | Icone pour fermer la liste des cases à cocher                 |
| emptyCommentLineIcon | Element |          | Icone pour ajouter un commentaire sur une case à cocher       |
| commentLineIcon      | Element |          | Icone pour modifier un commentaire d'une case à cocher        |
| questionLineIcon     | Element |          | Icone pour indiquer qu'il y a une question sur la ligne       |
| warningLineIcon      | Element |          | Icone pour indiquer que c'est une ligne avec un avertissement |

#### Fonctions appelées

| Nom         | Type     | Remarque | Commentaire                                               |
| ----------- | -------- | -------- | --------------------------------------------------------- |
| onChange    | Fonction | Obl.     | onChange(event)                                           |

### Spécificités

- Fonctionne avec l'objet InputCheckList

### Exemple

```
<InputCheckLists
  name="feat_checklists"
  value={values.feat_checklists}
  onChange={handleChange}
  error={getErrorMessage('feat_checklists')}
/>
```
![](./inputCheckLists.png)

### To Do
