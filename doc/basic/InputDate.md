## InputDate

Champ de saisie de date avec saisie depuis un calendrier.

### Props

#### Obligatoires

| Nom     | Type    | Commentaire                               |
| ------- | ------- | ----------------------------------------- |
| name    | Chaine  | Le nom du champ, en snakeCase si possible |
| delIcon | Element | Pour effacer le champ                     |
| calIcon | Element | Pour accéder au calendrier                |

#### Optionnels

| Nom         | Type     | Remarque  | Commentaire                             |
| ----------- | -------- | --------- | --------------------------------------- |
| id          | Chaine   |           | Identifiant                             |
| label       | Chaine   |           | Le libellé du champ, sans html          |
| value       |          |           | La valeur                               |
| onChange    | Fonction |           | onChange(event)                         |
| disabled    | Booléen  | Faux      | Pour désactiver le champ                |
| required    | Booléen  | Faux      | Pour rendre le champ obligatoire        |
| labelTop    | Booléen  | Vrai      | Le libellé s'affiche au dessus du champ |
| size        | Taille   |           | Pour changer la taille par défaut       |
| labelSize   | Taille   | 6         | Taille du libellé                       |
| inputSize   | Taille   | 30        | Taille du champ de saisie               |
| error       | Element  |           | Gestion du champ en erreur              |
| prepend     | Element  | null      | Gérer un élément à gauche du champ      |
| lockIcon    | Element  | null      | Gestion d'un bouton qui bloque le champ |
| borderColor | Chaine   | Secondary | Couleur du bord                         |

#### Fonctions appelées

| Nom          | Type     | Remarque | Commentaire     |
| ------------ | -------- | -------- | --------------- |
| onChange     | Fonction |          | onChange(event) |
| onLockToggle | Fonction | null     |                 |

### Exemple

```
<InputDate
  label="Créée le"
  name="feat_date"
  value={values.feat_date}
  onChange={handleChange}
  required={true}
  error={getErrorMessage('feat_date')}
  calIcon={<CalendarIcon className="text-secondary" size={0.9} />}
  delIcon={<DelOneIcon className="text-warning" size={0.9} />}
/>
```
