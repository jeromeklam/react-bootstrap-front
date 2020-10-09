## InputText

Champ de saisie texte à l'intétieur d'une ligne de saisie.

### Props

#### Obligatoires

| Nom          | Type     | Commentaire                                       |
| ------------ | -------- | ------------------------------------------------- |
| name         | Chaine   | Le nom du champ, en snakeCase si possible         |

#### Optionnels

| Nom          | Type     | Remarque | Commentaire                                       |
| ------------ | -------- | -------- | ------------------------------------------------- |
| id           | Chaine   |          | Identifiant                                       |
| value        | Chaine   |          | La valeur                                         |
| disabled     | Booléen  | Faux     | Pour désactiver le champ                          |
| required     | Booléen  | Faux     | Pour rendre le champ obligatoire                  |
| size         | Taille   |          | Pour changer la taille par défaut                 |
| error        | Element  |          | Gestion du champ en erreur                        |
| placeholder  | Chaine   | ''       | Texte indicatif dans le champ de saisie           |
| pattern      | Chaine   | ''       | Modèle de saisie (expression régulière) !         |

#### Fonctions appelées

| Nom          | Type     | Remarque | Commentaire                                       |
| ------------ | -------- | -------- | ------------------------------------------------- |
| onChange     | Fonction |          | onChange(event)                                   |

### Spécificités

- Il n'y a pas de label
- Si 'error' est renseigné l'élement erreur sera ajouté après
- l'attribut 'pattern' peut aider mais tous les navigateurs ne le gère pas
  (https://www.w3schools.com/tags/att_input_pattern.asp),
  il vaut mieux passer pas l'objet inputMask

### Exemple

```
<InlineInputText
  id="ct_code"
  name="ct_code"
  size="sm"
  value={values.ct_code}
  onChange={handleChange}
  error={getErrorMessage('ct_code')}
/>
```

### To Do

- Ajouter et gérer l'attribut 'warning' comme 'error' ?
- Ajouter et gérer l'attribut className ?
