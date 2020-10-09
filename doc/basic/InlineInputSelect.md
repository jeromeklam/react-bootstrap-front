## InlineInputSelect

Zone de saisie avec liste déroulante à l'intérieur d'une ligne de saisie.

### Props

#### Obligatoires

| Nom          | Type     | Commentaire                                       |
| ------------ | -------- | ------------------------------------------------- |
| name         | Chaine   | Le nom du champ, en snakeCase si possible         |

#### Optionnels

| Nom      | Type    | Remarque | Commentaire                                 |
| -------- | ------- | -------- | ------------------------------------------- |
| id       | Chaine  |          | Identifiant                                 |
| value    | Chaine  |          | La valeur                                   |
| disabled | Booléen | Faux     | Pour désactiver le champ                    |
| required | Booléen | Faux     | Pour rendre le champ obligatoire            |
| size     | Taille  |          | Pour changer la taille par défaut           |
| error    | Element |          | Gestion du champ en erreur                  |
| options  | Element | []       | Liste des options de la liste déroulante    |
| addEmpty | Booléen | Faux     | Ajout d'une valeur vide en plus des options |

#### Fonctions appelées

| Nom          | Type     | Remarque | Commentaire                                       |
| ------------ | -------- | -------- | ------------------------------------------------- |
| onChange     | Fonction |          | onChange(event)                                   |

### Spécificités

- Si 'id' non renseigné, l'identifiant sera 'name'
- Si 'error' est renseigné l'élement erreur sera ajouté après

### Exemple

```
<InlineInputSelect
  name="lang.id"
  size="sm"  
  inputSize={36}
  value={values.lang.id}
  onChange={handleChange}
  options={langAsOptions(props.languages)}
  error={getErrorMessage('lang.id')}
/>
```

### To Do

- Ajouter et gérer l'attribut className ?
- Ajouter la gestion d'une valeur par défaut addDefaultValue (comme InputSelect) au lieu du addEmpty?
- Gérer l'id comme l'InputText avec un nombre aléatoire ajouter à 'name'
