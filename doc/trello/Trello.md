## Trello

Objet permettant de gérer un Kanban à la mode Trello. 

### Props

#### Obligatoires

| Nom   | Type   | Commentaire                        |
| ----- | ------ | ---------------------------------- |
| data  | Object | La liste des colonnes du tableau   |

##### data

Pour une documentation complète, merci de se référer à la description d'un [board](./Board.md) 

#### Optionnels

| Nom       | Type   | Remarque | Commentaire                               |
| --------- | ------ | -------- | ----------------------------------------- |
| className | Chaine |          | Classe à ajouter à l'objet principal      |
| editable  | Bool   | false    | Pour autoriser la modification du tableau |
| lang      | Chaine | fr       | La langue par défaut                      |

##### className

Une ou plusieurs classes à ajouter uniquement à l'objet principal.

##### editable

Pour autoriser de manière globale la modification du tableau. Par défaut non éditable.

* Positionné à Faux bloque l'ensemble des possibiluté dont les déplacements.
* Positionné à Vrai permet via d'autres paramètres d'afficner les éléments modifiables, se référer à leur documentation.

### Exemple

```js
<Trello data={{lanes: []}} />
```

### To Do

- Plus de paramétrage du design