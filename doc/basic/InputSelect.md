## InputSelect

Zone de saisie avec liste déroulante.

### Props

#### Obligatoires

| Nom          | Type     | Commentaire                                       |
| ------------ | -------- | ------------------------------------------------- |
| name         | Chaine   | Le nom du champ, en snakeCase si possible         |

#### Optionnels

| Nom          | Type    | Remarque           | Commentaire                              |  
| ------------ | ------- | ------------------ | ---------------------------------------- |
| id           | Chaine  |                    | Identifiant                              |
| label        | Chaine  |                    | Le libellé du champ, sans html           |
| value        | Chaine  |                    | La valeur                                |
| disabled     | Booléen | Faux               | Pour désactiver le champ                 |
| required     | Booléen | Faux               | Pour rendre le champ obligatoire         |
| labelTop     | Booléen | Vrai               | Le libellé s'affiche au dessus du champ  |
| size         | Taille  |                    | Pour changer la taille par défaut        |
| labelSize    | Taille  | 6                  | Taille du libellé                        |
| inputSize    | Taille  | 30                 | Taille du champ de saisie                |
| error        | Element |                    | Gestion du champ en erreur               |
| warning      | Element |                    | Gestion du champ en anomalie             |
| options      | Element | []                 | Liste des options de la liste déroulante |
| addEmpty     | Booléen | Faux               | Ajout d'une ligne par défaut             |
| defaultLabel | Chaine  | 'Aucune sélection' | Libellé de la valeur par défaut          |
| defaultValue | Chaine  | ''                 | Valeur par défaut                        |
| inline       | Booléen | Faux               |                                          |
| datas        | Objet   | []                 |                                          |

#### Fonctions appelées

| Nom          | Type     | Remarque | Commentaire                                       |
| ------------ | -------- | -------- | ------------------------------------------------- |
| onChange     | Fonction |          | onChange(event)                                   |

### Spécificités

- Si 'id' non renseigné, l'identifiant sera 'name'
- Si 'error' ou 'warning' sont renseignés, le champ sera invalide ![](./is_invalid.png) et
  l'élement erreur anomalie sera ajouté après
  (le plus souvent celà sera un message d'erreur en dessous)
- datas est utilisé lors d'un changement de ligne ou quand la valeur n'est pas trouvée dans les options

### Exemple

```
<InputSelect
  label="Langue"
  name="lang.id"
  labelTop={true}
  value={values.lang ? values.lang.id : null}
  onChange={handleChange}
  options={langAsOptions(props.languages)}
/>
```

### To Do

- Ajouter et gérer l'attribut className ?
- Ajouter et gérer l'attribut help ?
- Gérer l'id comme l'InputText avec un nombre aléatoire ajouter à 'name'
- Renommer addEmpty en addDefault
- Supprimer Attribut inline ? Pas d'intérêt avec labelTop et pas juste inline -> inputSize=36 ??
