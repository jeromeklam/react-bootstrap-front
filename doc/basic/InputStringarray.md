## InputStringarea

Gestion d'un tableau de valeurs avec un libellé pour chaque valeur.

### Props

#### Obligatoires

| Nom       | Type     | Commentaire                               |
| --------- | -------- | ----------------------------------------- |
| name      | Chaine   | Le nom du champ, en snakeCase si possible |
| onChange  | Fonction | onChange(event)                           |
| plusIcon  | Element  | Pour ajouter une valeur                   |
| minusIcon | Element  | Pour supprimer une valeur                 |

#### Optionnels

| Nom        | Type    | Remarque | Commentaire                             |
| ---------- | ------- | -------- | --------------------------------------- |
| label      | Chaine  |          |                                         |
| value      | Chaine  |          | La valeur                               |
| labelTop   | Booléen | Vrai     | Le libellé s'affiche au dessus du champ |
| label      | Chaine  |          | Le libellé du champ, sans html          |
| titleLabel | Chaine  |          | Titre des valeurs                       |
| titleValue | Chaine  |          | Titre des libellés des valeurs          |

#### Fonctions appelées

| Nom          | Type     | Remarque | Commentaire                                       |
| ------------ | -------- | -------- | ------------------------------------------------- |
| onChange     | Fonction |          | onChange(event)                                   |


### Spécificités

- Format du tableau de valeurs : [{"value":"val1","label":"liblval1"},{"value":"val2","label":"libval2"},{"value":"val3","label":"libval3","new":true}]  
- On peut avoir une liste de valeur par défaut, les valeurs ajoutées par l'utilisateur pourront être supprimées en base (elles auront une info "new" à vrai)
  mais les valeurs par défaut seront juste marquées "delete":true si on les supprime (on ne les verra pas dans la liste)
  ou "updated":true si on les modifie

### Exemple

```
<InputStringarray
  name="brk_ips"
  titleValue="Valeur IP"
  titleLabel="Libellé"
  value={values.brk_ips}
  onChange={handleChange}
/>
```
