/**
 * Méthodes ajoutées au modèle pour la recherche (doc/recherche/composants.md,
 * « Modèle Filter : méthodes ajoutées »). La sortie envoyée à l'API est couverte
 * à part par filter.asJsonApiObject.test.js.
 */
import {
  Filter,
  FILTER_MODE_AND,
  FILTER_MODE_OR,
  FILTER_OPER_LIKE,
  FILTER_OPER_EQUAL,
  FILTER_OPER_EMPTY,
  FILTER_OPER_BETWEEN,
  FILTER_OPER_GREATER_OR_EQUAL,
  FILTER_OPER_LOWER_OR_EQUAL,
} from '../../../src/features/filter';

const normalize = value => {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  const keys = Object.keys(value);
  if (Array.isArray(value) && keys.every(k => /^\d+$/.test(k))) {
    return value.map(normalize);
  }
  return keys.reduce((acc, key) => {
    acc[key] = normalize(value[key]);
    return acc;
  }, {});
};
const api = filter => normalize(filter.asJsonApiObject());

const base = () => {
  const f = new Filter();
  f.init(FILTER_MODE_AND, FILTER_OPER_LIKE);
  f.addFilter('group.id', 15, FILTER_OPER_EQUAL, true);
  f.addFilter('cau_to', '2026-01-01', FILTER_OPER_GREATER_OR_EQUAL, false, true);
  f.addFilter('cli_town', 'Metz', FILTER_OPER_LIKE);
  return f;
};

describe('clone', () => {
  test('profond par défaut : le clone a ses propres critères', () => {
    const original = base();
    const copy = original.clone();
    copy.addFilter('cli_lastname', 'Dupont', FILTER_OPER_LIKE);
    copy.findFirst('cli_town').setFilterCrit('Nancy');
    copy.updateFilterOperator('cli_town', FILTER_OPER_EQUAL);
    expect(original.hasFilter('cli_lastname')).toBe(false);
    expect(original.findFirst('cli_town').getFilterCrit()).toBe('Metz');
    expect(original.findFirst('cli_town').getOperator()).toBe(FILTER_OPER_LIKE);
    expect(copy.findFirst('cli_town').getFilterCrit()).toBe('Nancy');
  });

  test('clone(false) garde l’ancienne copie superficielle', () => {
    const original = base();
    const copy = original.clone(false);
    copy.addFilter('cli_lastname', 'Dupont', FILTER_OPER_LIKE);
    expect(original.hasFilter('cli_lastname')).toBe(true);
  });

  test('le clone envoie la même requête', () => {
    const original = base();
    expect(api(original.clone())).toEqual(api(original));
  });
});

describe('removeAll', () => {
  test('garde les fixes et les défauts', () => {
    const f = base();
    f.removeAll();
    expect(f.hasFilter('cli_town')).toBe(false);
    expect(f.hasFilter('group.id')).toBe(true);
    expect(f.hasFilter('cau_to')).toBe(true);
  });

  test('peut aussi retirer les défauts', () => {
    const f = base();
    f.removeAll({ keepDefault: false });
    expect(f.hasFilter('cau_to')).toBe(false);
    expect(f.hasFilter('group.id')).toBe(true);
  });
});

describe('replaceFilter et setFilterValues', () => {
  test('plusieurs valeurs : jointes par des virgules, comme avant', () => {
    const f = base();
    f.setFilterValues('client_category.clic_id', [1, 3, 5]);
    expect(api(f).filter.and['client_category.clic_id']).toEqual({ eq: '1,3,5' });
  });

  test('remplace à la même place : l’ordre d’affichage ne bouge pas', () => {
    const f = base();
    f.addFilter('cli_email', 'a@b.fr', FILTER_OPER_LIKE);
    f.replaceFilter('cli_town', ['Nancy'], FILTER_OPER_EQUAL);
    expect(f.getFilters({ fixed: true }).map(e => e.getFilterName())).toEqual([
      'group.id',
      'cau_to',
      'cli_town',
      'cli_email',
    ]);
    expect(f.findFirst('cli_town').getOperator()).toBe(FILTER_OPER_EQUAL);
  });

  test('sans valeur : le critère est retiré', () => {
    const f = base();
    f.setFilterValues('cli_town', []);
    expect(f.hasFilter('cli_town')).toBe(false);
    f.setFilterValues('cli_town', ['', null, undefined]);
    expect(f.hasFilter('cli_town')).toBe(false);
  });

  test('empty / nempty : pas de valeur à saisir', () => {
    const f = base();
    f.replaceFilter('cli_email', [], FILTER_OPER_EMPTY);
    expect(api(f).filter.and.cli_email).toEqual({ empty: null });
  });

  test('between passe par setFilterRange', () => {
    const f = base();
    f.replaceFilter('don_real_ts', ['2025-01-01', '2025-12-31'], FILTER_OPER_BETWEEN);
    expect(api(f).filter.and.don_real_ts).toEqual({ between: ['2025-01-01', '2025-12-31'] });
  });

  test('les drapeaux sont respectés', () => {
    const f = base();
    f.replaceFilter('site.id', [3], FILTER_OPER_EQUAL, { fixed: true });
    expect(f.findFirst('site.id').isFixed()).toBe(true);
    expect(f.getFilters().map(e => e.getFilterName())).toEqual(['cau_to', 'cli_town']);
  });
});

describe('setFilterRange', () => {
  /* Seul between garde les valeurs brutes ; les autres opérateurs sortent en chaînes. */
  test('deux bornes → between', () => {
    const f = base();
    f.setFilterRange('don_mnt', 10, 100);
    expect(api(f).filter.and.don_mnt).toEqual({ between: [10, 100] });
  });

  test('borne basse seule → gte', () => {
    const f = base();
    f.setFilterRange('don_mnt', 10, null);
    expect(f.findFirst('don_mnt').getOperator()).toBe(FILTER_OPER_GREATER_OR_EQUAL);
    expect(api(f).filter.and.don_mnt).toEqual({ gte: '10' });
  });

  test('borne haute seule → ltwe', () => {
    const f = base();
    f.setFilterRange('don_mnt', '', 100);
    expect(f.findFirst('don_mnt').getOperator()).toBe(FILTER_OPER_LOWER_OR_EQUAL);
    expect(api(f).filter.and.don_mnt).toEqual({ ltwe: '100' });
  });

  test('aucune borne → retrait', () => {
    const f = base();
    f.setFilterRange('don_mnt', 10, 100);
    f.setFilterRange('don_mnt', null, '');
    expect(f.hasFilter('don_mnt')).toBe(false);
  });
});

describe('lecture', () => {
  test('getFilters : actifs hors fixes par défaut', () => {
    const f = base();
    expect(f.getFilters().map(e => e.getFilterName())).toEqual(['cau_to', 'cli_town']);
    expect(f.getFilters({ fixed: true }).length).toBe(3);
    expect(f.getFilters({ default: false }).map(e => e.getFilterName())).toEqual(['cli_town']);
    f.disableDefaults();
    expect(f.getFilters().map(e => e.getFilterName())).toEqual(['cli_town']);
    expect(f.getFilters({ enabledOnly: false }).length).toBe(2);
  });

  test('getValues : default, between, puis les « ou »', () => {
    const f = new Filter();
    f.init(FILTER_MODE_AND, FILTER_OPER_LIKE);
    f.setFilterValues('clic_id', [1, 3, 5]);
    expect(f.findFirst('clic_id').getValues()).toEqual([1, 3, 5]);
    f.setFilterRange('don_ts', 'a', 'b');
    expect(f.findFirst('don_ts').getValues()).toEqual(['a', 'b']);
  });

  test('hasFilter voit aussi les critères désactivés', () => {
    const f = base();
    f.disableDefaults();
    expect(f.hasFilter('cau_to')).toBe(true);
    expect(f.findFirst('cau_to')).toBeUndefined();
  });
});

describe('toPlain / fromPlain', () => {
  test('aller-retour : même requête, même forme simple', () => {
    const f = base();
    f.setFilterValues('clic_id', [1, 5]);
    f.setFilterRange('don_ts', '2025-01-01', '2025-12-31');
    f.replaceFilter('cli_email', [], FILTER_OPER_EMPTY);
    f.disableDefaults();
    const plain = f.toPlain();
    expect(plain.mode).toBe(FILTER_MODE_AND);
    expect(plain.filters.find(p => p.name === 'cli_email')).toEqual({
      name: 'cli_email',
      operator: FILTER_OPER_EMPTY,
      values: [],
      fixed: false,
      default: false,
      enable: true,
    });
    const back = Filter.fromPlain(JSON.parse(JSON.stringify(plain)));
    expect(api(back)).toEqual(api(f));
    expect(back.toPlain()).toEqual(plain);
  });

  test('un objet vide donne un filtre vide en mode OU', () => {
    const f = Filter.fromPlain({});
    expect(f.getMode()).toBe(FILTER_MODE_OR);
    expect(api(f)).toEqual({});
  });
});

describe('setFilterCrit', () => {
  test('une clé vide ou fausse écrit bien la valeur par défaut', () => {
    const f = new Filter();
    f.setFilterName('cli_town');
    f.setFilterCrit('Metz', FILTER_OPER_LIKE, '');
    expect(f.getFilterCrit()).toBe('Metz');
    f.setFilterCrit('Nancy', false, false);
    expect(f.getFilterCrit()).toBe('Nancy');
    expect(Object.keys(f.getFilterCrits())).toEqual(['default']);
  });
});
