import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Normalise la structure des variables de fusion.
 *
 * Accepte la forme groupée `[{ group, items: [{ code, label, help }] }]` et
 * l'ancienne forme plate `[{ text_code, text_content }]` de `presetTexts`,
 * repliée en un groupe unique. La prop historique reste donc fonctionnelle.
 */
export function normalizeMergeVars(mergeVars, fallbackGroupLabel) {
  if (!Array.isArray(mergeVars) || mergeVars.length === 0) {
    return [];
  }
  const flat = [];
  const groups = [];
  for (let i = 0; i < mergeVars.length; i++) {
    const entry = mergeVars[i];
    if (!entry) {
      continue;
    }
    if (Array.isArray(entry.items)) {
      groups.push({
        key: entry.key || entry.group || String(i),
        group: entry.group || '',
        items: entry.items.filter(item => item && item.code),
      });
    } else if (entry.code || entry.text_code) {
      flat.push({
        code: entry.code || entry.text_code,
        label: entry.label || entry.text_content || entry.code || entry.text_code,
        help: entry.help || '',
      });
    }
  }
  if (flat.length > 0) {
    groups.push({ key: '__flat__', group: fallbackGroupLabel || '', items: flat });
  }
  return groups;
}

function matches(item, needle) {
  if (needle === '') {
    return true;
  }
  const haystack = ((item.label || '') + ' ' + (item.code || '')).toLowerCase();
  return haystack.indexOf(needle) !== -1;
}

/**
 * Menu d'insertion des variables de fusion.
 * Le champ de filtre devient indispensable dès une trentaine de variables.
 */
export default class MergeMenu extends Component {
  static propTypes = {
    groups: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { filter: '' };
    this.onFilter = this.onFilter.bind(this);
  }

  onFilter(ev) {
    this.setState({ filter: ev.target.value.toLowerCase() });
  }

  render() {
    const { groups, onSelect, t } = this.props;
    const needle = this.state.filter;
    const visible = groups
      .map(group => ({ ...group, items: group.items.filter(item => matches(item, needle)) }))
      .filter(group => group.items.length > 0);

    return (
      <div className="rbf-editor-mergemenu">
        <div className="rbf-editor-mergemenu-search">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder={t({ id: 'ui.editor.mergevar.search', defaultMessage: 'Search a variable' })}
            value={this.state.filter}
            onChange={this.onFilter}
            /* Le clic dans le champ ne doit pas refermer le menu. */
            onClick={ev => ev.stopPropagation()}
            onMouseDown={ev => ev.stopPropagation()}
          />
        </div>
        <div className="rbf-editor-mergemenu-list">
          {visible.length === 0 && (
            <div className="dropdown-item-text text-muted">
              {t({ id: 'ui.editor.mergevar.empty', defaultMessage: 'No variable' })}
            </div>
          )}
          {visible.map(group => (
            <div key={group.key}>
              {group.group !== '' && <h6 className="dropdown-header">{group.group}</h6>}
              {group.items.map(item => (
                <button
                  key={item.code}
                  type="button"
                  className="dropdown-item rbf-editor-mergemenu-item"
                  title={item.help || item.code}
                  onMouseDown={ev => ev.preventDefault()}
                  onClick={() => onSelect(item)}
                >
                  <span className="rbf-editor-mergemenu-label">{item.label}</span>
                  <small className="text-muted d-block">{item.code}</small>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
