## InputLabel

Objet permettant d'ajouter une étape dans le guide de l'application (Aide). 

### Props

#### Obligatoires

| Nom   | Type   | Commentaire       |
| ----- | ------ | ----------------- |
| theme | Chaine | Thème de l'aide   |
| title | Chaine | Texte d'aide      |

#### Optionnels

| Nom      | Type   | Remarque | Commentaire                   |
| -------- | ------ | -------- | ----------------------------- |
| position | Chaine | bottom   | Position de la fenêtre d'aide |

### Exemple

```
<Highlight title="Bouton de recherche" theme="SEARCH">
  <button type="button">Rechercher</button>
</Highlight>
```

### To Do

- Gérer plus de position
- Gérer les objets hors écran ou cachés
- ScrollTo sur de grande pages
