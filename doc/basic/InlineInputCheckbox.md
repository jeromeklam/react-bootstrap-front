## InlineInputCheckbox

Champ interrupteur classique à l'intérieur d'une ligne de saisie.

### Props

#### Obligatoires

| Nom     | Type    | Commentaire                                      |
| ------- | ------- | ------------------------------------------------ |
| name    | Chaine  | Le nom du champ, en snakeCase si possible        |

#### Optionnels

| Nom      | Type    | Remarque | Commentaire                       |
| -------- | ------- | -------- | --------------------------------- |
| id       | Chaine  |          | Identifiant                       |
| label    | Chaine  |          | Le libellé du champ, sans html    |
| disabled | Booléen | Faux     | Pour désactiver le champ          |
| required | Booléen | Faux     | Pour rendre le champ obligatoire  |
| size     | Taille  |          | Pour changer la taille par défaut |
| checked  | Booléen | Faux     | Valeur                            |

#### Fonctions appelées

| Nom          | Type     | Remarque | Commentaire                                       |
| ------------ | -------- | -------- | ------------------------------------------------- |
| onChange     | Fonction | Obl.     | onChange(event)                                   |


### Spécificités

- Le libellé sera écrit à droite de la coche

### Exemple

```
<InlineInputCheckbox
  label="Envoyer les news"
  id="send_news"
  name="send_news"
  labelTop={false}
  size="sm"
  checked={values.send_news}
  onChange={handleChange}
/>
```

### To Do

- Ajouter et gérer l'attribut 'className'
- Ajouter et gérer les attributs 'error' et 'warning'
