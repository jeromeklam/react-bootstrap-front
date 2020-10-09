## InputRadio

Champ sélecteur classique.

### Props

#### Obligatoires

| Nom     | Type    | Commentaire                                      |
| ------- | ------- | ------------------------------------------------ |
| name    | Chaine  | Le nom du champ, en snakeCase si possible        |
| options | Elément | Tableau avec le libélle et la valeur des options |

#### Optionnels

| Nom          | Type     | Remarque | Commentaire                                       |
| ------------ | -------- | -------- | ------------------------------------------------- |
| value        | Chaine   |          | La valeur                                         |
| labelTop     | Booléen  | Vrai     | Le libellé s'affiche au dessus du champ           |

#### Fonctions appelées

| Nom          | Type     | Remarque | Commentaire                                       |
| ------------ | -------- | -------- | ------------------------------------------------- |
| onChange     | Fonction | Obl.     | onChange(event)                                   |

### Spécificités

- Les éléments du  tableau d'options ont obligatoirement 'label' et 'value' à renseigner

### Exemple

```
<InputRadio
  name="mode"
  value={mode}
  onChange={this.props.onMode}
  options={[{ label: 'et', value: FILTER_MODE_AND }, { label: 'ou', value: FILTER_MODE_OR }]}
/>
```

### To Do

- Ajouter l'attribut 'id'
- Ajouter et gérer l'attribut 'className'
