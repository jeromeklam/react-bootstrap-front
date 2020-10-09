## InputSpin

Champ avec une plage de valeurs accessibles par 2 boutons pour incrémenter et décrémenter.

### Props

#### Obligatoires

| Nom       | Type    | Commentaire                               |
| --------- | ------- | ----------------------------------------- |
| name      | Chaine  | Le nom du champ, en snakeCase si possible |
| minValue  | Nombre  | Valeur minimum                            |
| maxValue  | Nombre  | Valeur Maximum                            |
| clearIcon | Element | Objet du bouton vider la valeur           |
| downIcon  | Element | Objet du bouton qui décrémente la valeur  |
| upIcon    | Element | Objet du bouton qui incrémente la valeur  |

#### Optionnels

| Nom           | Type    | Remarque | Commentaire                             |
| ------------- | ------- | -------- | --------------------------------------- |
| label         | Chaine  |          | Le libellé du champ, sans html          |
| value         | Nombre  | 0        | La valeur                               |
| disabled      | Booléen | Faux     | Pour désactiver le champ                |
| required      | Booléen | Faux     | Pour rendre le champ obligatoire        |
| labelTop      | Booléen | Vrai     | Le libellé s'affiche au dessus du champ |
| size          | Taille  |          | Pour changer la taille par défaut       |
| labelSize     | Taille  | 6        | Taille du libellé                       |
| inputSize     | Taille  | 30       | Taille du champ de saisie               |
| error         | Element |          | Gestion du champ en erreur              |
| warning       | Element |          | Gestion du champ en anomalie            |
| step          | Nombre  | 1        | Pas de progression de la valeur         |
| defaultValMin | Booléen | Faux     | Par défaut valeur minimum ou maximum    |
| inline        | Booléen |          | Libellé + input sur une seule ligne     |
| options       | Elément | []       |                                         |

#### Fonctions appelées

| Nom         | Type     | Remarque | Commentaire     |
| ----------- | -------- | -------- | --------------- |
| onChange    | Fonction |          | onChange(event) |

### Spécificités

- Pas d'id
- Si 'error' ou 'warning' sont renseignés, le champ sera invalide ![](./is_invalid.png) et
  l'élement erreur anomalie sera ajouté après
  (le plus souvent celà sera un message d'erreur en dessous)

### Exemple

```
<InputSpin
  label="Priorité"
  name="feat_priority"
  value={values.feat_priority}
  maxValue={10}
  minValue={1}
  onChange={handleChange}
  labelTop={true}
  error={getErrorMessage('feat_priority')}
  upIcon={<UpIcon />}
  downIcon={<DownIcon />}
  clearIcon={<DelOneIcon />}
/>
```
Par défaut valeur maximum 10 et on peut décrémenter cette valeur de 1 jusqu'à la priorité 1

### To Do

- inline est utilisé à la place du labelTop peut-être faire comme les autres input ?
- Supprimer options qui n'est pas utilisé ou gérer un tableau de valeur
