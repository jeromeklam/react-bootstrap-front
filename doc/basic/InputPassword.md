## InputPassword

Champ de saisie de type mot de passe avec la saisie remplacée par des points.

### Props

#### Obligatoires

| Nom          | Type     | Commentaire                                       |
| ------------ | -------- | ------------------------------------------------- |
| name         | Chaine   | Le nom du champ, en snakeCase si possible         |

#### Optionnels

| Nom          | Type    | Remarque | Commentaire                               |
| ------------ | ------- | -------- | ----------------------------------------- |
| id           | Chaine  |          | Identifiant                               |
| label        | Chaine  |          | Le libellé du champ, sans html            |
| value        | Chaine  |          | La valeur                                 |
| disabled     | Booléen | Faux     | Pour désactiver le champ                  |
| required     | Booléen | Faux     | Pour rendre le champ obligatoire          |
| labelTop     | Booléen | Vrai     | Le libellé s'affiche au dessus du champ   |
| size         | Taille  |          | Pour changer la taille par défaut         |
| labelSize    | Taille  | 6        | Taille du libellé                         |
| inputSize    | Taille  | 30       | Taille du champ de saisie                 |
| error        | Element |          | Gestion du champ en erreur                |
| warning      | Element |          | Gestion du champ en anomalie              |
| autoComplete | Chaine  | off      | Type d'autocomplétion à utiliser          |
| placeholder  | Chaine  | ''       | Texte indicatif dans le champ de saisie   |
| pattern      | Chaine  |          | Modèle de saisie (expression régulière) ! |
| securityIcon | Element | null     | Indication de la robustesse               |
| viewIcon     | Element | null     | Pour avoir un bouton de visualisation     |

#### Fonctions appelées

| Nom          | Type     | Remarque | Commentaire                                       |
| ------------ | -------- | -------- | ------------------------------------------------- |
| onChange     | Fonction |          | onChange(event)                                   |

### Spécificités

- Si 'id' non renseigné, l'identifiant sera 'name-' valeur aléatoire entre 10000 et 99999
- Si 'error' ou 'warning' sont renseignés, le champ sera invalide ![](./is_invalid.png) et
  l'élement erreur anomalie sera ajouté après
  (le plus souvent celà sera un message d'erreur en dessous)
- Un bouton peut être ajouté pour visualiser le mot de passe au bouton down et pas sur le clic
- Une icône peut être rajoutée pour avoir une indication de la robustesse
  (l'icône change de couleur et la bulle d'aide change en fonction du niveau de robustesse :
  Danger : pas assez de caractère (8 au minimum)
  Warning : longueur bonne mais pas de majuscule ou pas de minuscule ou pas de chiffre
  Secondary : il n'y a pas de caractère spéciaux
  Primary : Longueur bonne, contient des majuscules, des miniscules, des chiffres et des caractères spéciaux)
  Rien n'est bloquant, c'est juste une indication

### Exemple

```
<InputPassword
  id="password"
  name="password"
  label="Mot de passe"
  required
  value={this.state.password}
  error={this.state.password_error}
  onChange={this.onChange}
/>
```

### To Do

- Ajouter et gérer l'attribut className ?
- Ajouter et gérer l'attribut help ?
- Ajouter 'labelInline'? Remplacé pas 'LabelTop' ?
- Gérer les bulles d'aides de l'indicateur de robustesse avec intl pour les différentes langues
