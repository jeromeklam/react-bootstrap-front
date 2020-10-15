## InputRandomText

Champ de saisie dans lequel on peut générer une chaîne aléatoire d'une taille donnée.

### Props

#### Obligatoires

| Nom        | Type    | Commentaire                               |
| ---------- | ------- | ----------------------------------------- |
| name       | Chaine  | Le nom du champ, en snakeCase si possible |
| randomIcon | Element | Pour générer une valeur par défaut        |
| removeIcon | Element | Pour effacer le champ                     |

#### Optionnels

| Nom       | Type    | Remarque | Commentaire                             |
| --------- | ------- | -------- | --------------------------------------- |
| id        | Chaine  |          | Identifiant                             |
| label     | Chaine  |          | Le libellé du champ, sans html          |
| value     | Chaine  |          | La valeur                               |
| disabled  | Booléen | Faux     | Pour désactiver le champ                |
| required  | Booléen | Faux     | Pour rendre le champ obligatoire        |
| labelTop  | Booléen | Vrai     | Le libellé s'affiche au dessus du champ |
| size      | Taille  |          | Pour changer la taille par défaut       |
| labelSize | Taille  | 6        | Taille du libellé                       |
| inputSize | Taille  | 30       | Taille du champ de saisie               |
| error     | Element |          | Gestion du champ en erreur              |
| warning   | Element |          | Gestion du champ en anomalie            |
| length    | Number  | 32       | Taille de la chaîne à générer           |

#### Fonctions appelées

| Nom          | Type     | Remarque | Commentaire                                       |
| ------------ | -------- | -------- | ------------------------------------------------- |
| onChange     | Fonction |          | onChange(event)                                   |

### Spécificités

- Si 'id' non renseigné, l'identifiant sera 'name-' valeur aléatoire entre 10000 et 99999
- Si 'error' ou 'warning' sont renseignés, le champ sera invalide ![](./is_invalid.png) et
  l'élement erreur anomalie sera ajouté après
  (le plus souvent celà sera un message d'erreur en dessous)

### Exemple

```
<InputRandomText
  label="Certificat"
  name="brk_certificate"
  value={values.brk_certificate}
  onChange={handleChange}
/>
```

### To Do

- Champ non saisissable par défaut ? Mais pas forcément grisé (disabled) ?
