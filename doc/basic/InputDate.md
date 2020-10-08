## InputDate

Champ de saisie de date avec saisie depuis un calendrier Aucun contrôle, ... d'autres composants sont disponibles au besoin pour des dates, expressions régulières.

### Props

| Nom         | Type     | Remarque   | Commentaire                               |
|-------------|----------|------------|-------------------------------------------|
| id          | Chaine   |            | Le nom du champ, en snakeCase si possible |
| borderColor | Chaine   |            | Le libellé du champ, sans html            |
| prepend     |    |            | La valeur                                 |
| onChange    | Fonction |            | onChange(event)                           |
| disabled    | Booléen  | Faux       | Pour désactiver le champ                  |
| required    | Booléen  | Faux       | Pour rendre le champ obligatoire          |
| labelTop    | Booléen  | Vrai       | Le libellé s'affiche au dessus du champ   |
| size        | Taille   |            | Pour changer la taille par défaut         |

    : PropTypes.element,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.string,
    onLockToggle: PropTypes.func,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    size: PropTypes.string,
    labelSize: PropTypes.number,
    inputSize: PropTypes.number,
    delIcon: PropTypes.element.isRequired,
    calIcon: PropTypes.element.isRequired,
    lockIcon: PropTypes.element,
    error: PropTypes.element,

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
