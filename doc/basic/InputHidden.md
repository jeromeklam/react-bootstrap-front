## InputHidden

Champ caché avec juste le nom et la valeur obligatoire !

### Props

#### Obligatoires

| Nom          | Type     | Commentaire                                       |
| ------------ | -------- | ------------------------------------------------- |
| name         | Chaine   | Le nom du champ, en snakeCase si possible         |
| value        | Chaine   | La valeur                                         |

#### Optionnels

| Nom          | Type     | Remarque | Commentaire                                       |
| ------------ | -------- | -------- | ------------------------------------------------- |
| id           | Chaine   |          | Identifiant                                       |

### Spécificités

- Valeur obligatoire

### Exemple

```
<InputHidden
  name="id"
  id="id"
  value={values.id}
/>
```
