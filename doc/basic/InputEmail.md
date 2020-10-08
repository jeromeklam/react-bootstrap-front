## InputEmail

Champ de saisie de texte d'un email avec contrôle format.

### Props

#### Obligatoires

| Nom          | Type     | Remarque | Commentaire                                       |
| ------------ | -------- | -------- | ------------------------------------------------- |
| name         | Chaine   | Obl.     | Le nom du champ, en snakeCase si possible         |

#### Optionnels

| Nom          | Type     | Remarque | Commentaire                                       |
| ------------ | -------- | -------- | ------------------------------------------------- |
| id           | Chaine   |          | Identifiant                                       |
| label        | Chaine   |          | Le libellé du champ, sans html                    |
| value        | Chaine   |          | La valeur                                         |
| disabled     | Booléen  | Faux     | Pour désactiver le champ                          |
| required     | Booléen  | Faux     | Pour rendre le champ obligatoire                  |
| labelTop     | Booléen  | Vrai     | Le libellé s'affiche au dessus du champ           |
| size         | Taille   |          | Pour changer la taille par défaut                 |
| labelSize    | Taille   | 6        | Taille du libellé                                 |
| inputSize    | Taille   | 30       | Taille du champ de saisie                         |
| error        | Element  |          | Gestion du champ en erreur                        |
| warning      | Element  |          | Gestion du champ en anomalie                      |
| autoComplete | Chaine   | off      | Type d'autocomplétion à utiliser                  |
| placeholder  | Chaine   | ''       | Texte indicatif dans le champ de saisie           |
| pattern      | Chaine   |          | Modèle de saisie (expression régulière) !         |

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
<InputEmail
  name="user_mail"
  label="Email"
  required="true"
  value={values.user_mail}
  onChange={handleChange}
  error={getErrorMessage('user_mail')}
/>
```

### To Do

- Ajouter et gérer l'attribut 'className' ?
- Ajouter et gérer l'attribut 'help' ?
- Ajouter 'autoFocus'
- Ajouter 'labelInline'? Remplacé pas 'LabelTop' ?
- Effectuer le contrôle de la validité du mail
  le type 'email' n'étant pas bien géré dans tous les navigateurs.
