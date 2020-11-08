## InputLabel

Objet permettant d'ajouter une étape dans le guide de l'application (Aide). 

### Props

#### Obligatoires

| Nom   | Type   | Commentaire       |
| ----- | ------ | ----------------- |
| theme | Chaine | Thème de l'aide   |
| title | Chaine | Texte d'aide      |

##### theme

Une chaine, si possible en majuscule sans caractères spéciaux pour regrouper un ensemble d'aide. 
Le parcours se fera via les thèmes grâce au composant HighlightButton.

##### title

La description de l'aide sous forme de chaine. Utiliser \[RC\] pour représenter un retour chariot.

#### Optionnels

| Nom      | Type   | Remarque | Commentaire                   |
| -------- | ------ | -------- | ----------------------------- |
| position | Chaine | bottom   | Position de la fenêtre d'aide |

##### position

Position de la fenêtre par rapport à la zone à expliquer.
Valeurs possibles :

* top
* bottom (par défaut)
* left
* right

### Exemple

```js
<Highlight title="Bouton de recherche" theme="SEARCH">
  <button type="button">Rechercher</button>
</Highlight>
```

### To Do

- Gérer plus de position
- Gérer les objets hors écran ou cachés
- ScrollTo sur de grande pages
- Responsive position (xs, sm, ...)
- title as component