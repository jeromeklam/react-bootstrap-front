## InputText

Champ de saisie de texte, tout ce qu'il y a de plus simple. Aucun contrôle, ... d'autres composants sont disponibles au besoin pour des dates, expressions régulières.

### Props

#### Obligatoires

| Nom          | Type     | Commentaire                                       |
| ------------ | -------- | ------------------------------------------------- |
| name         | Chaine   | Le nom du champ, en snakeCase si possible         |

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
| className    | Chaine   |          | Gestion Attribut class                            |
| maxLength    | Nombre   | 9999     | Nombre de caractères maximal qui peut être saisie |
| append       | Element  |          | Elément à mettre dans le champ à la fin           |
| prepend      | Element  |          | Non géré pour l'instant                           |
| help         | Element  |          | Elément d'aide sous le champ                      |

#### Fonctions appelées

| Nom          | Type     | Remarque | Commentaire                                       |
| ------------ | -------- | -------- | ------------------------------------------------- |
| onChange     | Fonction |          | onChange(event)                                   |


### Spécificités

- Si 'id' non renseigné, l'identifiant sera 'name-' valeur aléatoire entre 10000 et 99999
- Si 'error' ou 'warning' sont renseignés, le champ sera invalide ![](./is_invalid.png) et
  l'élement erreur anomalie sera ajouté après
  (le plus souvent celà sera un message d'erreur en dessous)
- l'attribut 'pattern' peut aider mais tous les navigateurs ne le gère pas
  (https://www.w3schools.com/tags/att_input_pattern.asp),
  il vaut mieux passer pas l'objet inputMask

### Exemple

```
<InputText
  label="Nom"
  name="grp_name"
  id="grp_name"
  required={true}
  value={values.grp_name}
  onChange={handleChange}
  error={getErrorMessage('grp_name')}
/>
```

### To Do

- prepend  : à faire
- append  : à gérer mieux avec input-group sur le champ
