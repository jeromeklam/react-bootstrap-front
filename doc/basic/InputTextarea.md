## InputTextarea

Champ de saisie d'un bloc de texte avec outils de mise en forme.

### Props

#### Obligatoires

| Nom          | Type     | Commentaire                                       |
| ------------ | -------- | ------------------------------------------------- |
| name         | Chaine   | Le nom du champ, en snakeCase si possible         |

#### Optionnels

| Nom         | Type    | Remarque | Commentaire                                         |
| ----------- | ------- | -------- | --------------------------------------------------- |
| id          | Chaine  |          | Identifiant                                         |
| label       | Chaine  |          | Le libellé du champ, sans html                      |
| value       | Chaine  |          | La valeur                                           |
| disabled    | Booléen | Faux     | Pour désactiver le champ                            |
| required    | Booléen | Faux     | Pour rendre le champ obligatoire                    |
| labelTop    | Booléen | Vrai     | Le libellé s'affiche au dessus du champ             |
| size        | Taille  |          | Pour changer la taille par défaut                   |
| clearIcon   | Elément |          | Objet pour le bouton pour vider le bloc             |
| toolbarIcon | Elément |          | Objet pour le bouton qui affichage la barre de menu |

#### Fonctions appelées

| Nom          | Type     | Remarque | Commentaire                                       |
| ------------ | -------- | -------- | ------------------------------------------------- |
| onChange     | Fonction |          | onChange(event)                                   |

### Spécificités

- 'size' est utilisé seulement sur les boutons

### Exemple

```
<InputTextarea
  label='Commentaire'
  name="ct_comm"
  value={values.ct_comm}
  onChange={handleChange}
  error={getErrorMessage('ct_comm')}
/>
```

### To Do

- 'id' n'est pas utilisé : à supprimer ?
