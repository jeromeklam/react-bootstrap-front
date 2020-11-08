## InputLabel

Objet permettant d'afficher un après l'autres les aide définies via les objets Highlight.

### Props

#### Obligatoires

| Nom   | Type   | Commentaire       |
| ----- | ------ | ----------------- |
| theme | Chaine | Thème à parcourir |

##### theme

Le thème à parcourir. Les composant ayant le thème indiqué seront affichés les uns après les autres.

#### Optionnels

| Nom      | Type   | Remarque | Commentaire                         |
| -------- | ------ | -------- | ----------------------------------- |
| delay    | Entier |          | Délais pour un parcours automatique |

##### delay

La durée en seconde à attendre avant de passer au prochain élément en mode automatique. 5s par défaut.

### Exemple

```js
<HighlightButton theme="SEARCH" />
```

```js
<HighlightButton theme="SEARCH">
  <button>Aide</button>
</HighlightButton>
```

### To Do

- Décomposer un peu mieux en sous composants
- Ajouter les tests
