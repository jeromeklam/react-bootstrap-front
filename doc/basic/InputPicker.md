## InputPicker

Champ de saisie de texte, tout ce qu'il y a de plus simple. Aucun contrôle, ... d'autres composants sont disponibles au besoin pour des dates, expressions régulières.

### Props

#### Obligatoires

| Nom       | Type     | Commentaire                               |
| --------- | -------- | ----------------------------------------- |
| name      | Chaine   | Le nom du champ, en snakeCase si possible |
| label     | Chaine   | Le libellé du champ                       |
| list      | Element  |                                           |
| onClear   | Fonction | Action qui vide le champ                  |
| onMore    | Fonction |                                           |
| onChange  | Fonction |                                           |
| onSelect  | Fonction |                                           |
| clearIcon | Element  | Pour vider le champ                       |
| moreIcon  | Element  |                                           |

#### Optionnels

| Nom           | Type    | Remarque | Commentaire                             |
| ------------- | ------- | -------- | --------------------------------------- |
| value         | Chaine  | ''       | La valeur                               |
| disabled      | Booléen | Faux     | Pour désactiver le champ                |
| required      | Booléen | Faux     | Pour rendre le champ obligatoire        |
| labelTop      | Booléen | Vrai     | Le libellé s'affiche au dessus du champ |
| size          | Taille  |          | Pour changer la taille par défaut       |
| labelSize     | Taille  | 6        | Taille du libellé                       |
| inputSize     | Taille  | 30       | Taille du champ de saisie               |
| error         | Element | Faux     | Gestion du champ en erreur              |
| zoomIcon      | Element | null     | Pour zoomer ou rechercher un élément    |
| addIcon       | Element | null     | Pour ajouter un élément non trouvé      |
| display       | Chaine  | ''       |                                         |
| pickerUp      | Booléen | Faux     |                                         |
| pickerId      | Chaine  | ''       |                                         |
| pickerDisplay | Chaine  | ''       |                                         |

#### Fonctions appelées

| Nom    | Type     | Remarque | Commentaire |
| ------ | -------- | -------- | ----------- |
| onZoom | Fonction | Null     |             |
| onAdd  | Fonction | Null     |             |

### Spécificités

- Si 'error' est renseigné, le champ sera invalide ![](./is_invalid.png) et
  l'élement erreur anomalie sera ajouté après
  (le plus souvent celà sera un message d'erreur en dessous)

### Exemple

```
<InputPicker
  {...this.props}
  name={this.props.name}
  label={this.props.label}
  labelTop={true}
  value={this.state.value || ''}
  list={this.props.list || this.state.list}
  display={this.state.display}
  onChange={this.props.onFineChange || this.onChange}
  onClear={this.onClear}
  onMore={this.onMore}          
  onZoom={this.onZoom}
  error={this.props.error}
  onSelect={this.onSelect}
  required={this.props.required || false}
  pickerId="user_id"
  pickerDisplay={getFullName}
  filters={this.props.filters || {}}
  clearIcon={<DelOne className="text-warning" size={0.9} />}
  moreIcon={<More className="text-secondary" size={0.9} />}
  zoomIcon={<Zoom className="text-secondary" size={0.9} />}
/>
```

### To Do
