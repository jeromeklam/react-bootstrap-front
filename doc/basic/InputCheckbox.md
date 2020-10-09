## InputCheckbox

Champ interrupteur classique (case à cocher).

### Props

#### Obligatoires

| Nom     | Type    | Commentaire                                      |
| ------- | ------- | ------------------------------------------------ |
| name    | Chaine  | Le nom du champ, en snakeCase si possible        |

#### Optionnels

| Nom       | Type    | Remarque | Commentaire                                   |
| --------- | ------- | -------- | --------------------------------------------- |
| id        | Chaine  |          | Identifiant                                   |
| label     | Chaine  |          | Le libellé du champ, sans html                |
| disabled  | Booléen | Faux     | Pour désactiver le champ                      |
| required  | Booléen | Faux     | Pour rendre le champ obligatoire              |
| labelTop  | Booléen | Vrai     | Le libellé s'affiche au dessus du champ       |
| labelSize | Taille  | 6        | Taille du libellé                             |
| inputSize | Taille  | 30       | Taille du champ de saisie                     |
| checked   | Booléen | Faux     | Valeur                                        |
| detail    | Elément | ''       | Elément à mettre après (texte de la checkbox) |

#### Fonctions appelées

| Nom          | Type     | Remarque | Commentaire                                       |
| ------------ | -------- | -------- | ------------------------------------------------- |
| onChange     | Fonction | Obl.     | onChange(event)                                   |

### Spécificités

- Le libellé sera écrit au dessus si labelTop = Vrai sinon il sera écrit avant la coche
  mais pour avoir le texte à droite de la coche, il faut utiliser l'attribut 'detail'

### Exemple

```
<InputCheckbox
  label="Actif"
  name="ct_active"
  labelTop={true}
  checked={values.ct_active === true}
  onChange={handleChange}
/>
```

### To Do

- Ajouter et gérer l'attribut 'className'
