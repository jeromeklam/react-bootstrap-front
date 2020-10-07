## InputText

Champ de saisie de texte, tout ce qu'il y a de plus simple. Aucun contrôle, ... d'autres composants sont disponibles au besoin pour des dates, expressions régulières.

### Props

| Nom       | Type     | Remarque   | Commentaire                               |
|-----------|----------|------------|-------------------------------------------|
| name      | Chaine   | Obl.       | Le nom du champ, en snakeCase si possible |
| label     | Chaine   |            | Le libellé du champ, sans html            |
| value     | Chaine   |            | La valeur                                 |
| onChange  | Fonction |            | onChange(event)                           |
| disabled  | Booléen  | Faux       | Pour désactiver le champ                  |
| required  | Booléen  | Faux       | Pour rendre le champ obligatoire          |
| labelTop  | Booléen  | Vrai       | Le libellé s'affiche au dessus du champ   |
| size      | Taille   |            | Pour changer la taille par défaut         |

### Exemple

```
<div className="col-sm-16">
  <InputText
    label={props.intl.formatMessage({
      id: 'app.features.group.form.name',
      defaultMessage: 'Nom',
    })}
    name="grp_name"
    id="grp_name"
    required={true}
    value={values.grp_name}
    onChange={handleChange}
    error={getErrorMessage('grp_name')}
  />
</div>
```
