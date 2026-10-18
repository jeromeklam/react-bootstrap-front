import {
  getOperatorsForType,
  getFieldOperators,
  operatorLabel,
  operatorPhrase,
  needsValue,
  isRange,
  defaultOperatorForType,
  OPERATORS_BY_TYPE,
} from '../../../src/features/search';

const values = list => list.map(o => o.value);

test('matrice par type : texte, ordonnés, choix, booléen', () => {
  expect(values(getOperatorsForType('text'))).toEqual(['contains', 'ncontains', 'containsb', 'containse', 'soundex', 'eq', 'neq', 'empty', 'nempty']);
  expect(values(getOperatorsForType('date'))).toEqual(['eq', 'neq', 'gt', 'gte', 'ltw', 'ltwe', 'between', 'empty', 'nempty']);
  expect(values(getOperatorsForType('number'))).toContain('between');
  expect(values(getOperatorsForType('monetary'))).toEqual(values(getOperatorsForType('number')));
  expect(values(getOperatorsForType('select'))).toEqual(['eq', 'neq', 'empty', 'nempty']);
  expect(values(getOperatorsForType('bool'))).toEqual(['eq', 'empty', 'nempty']);
  expect(values(getOperatorsForType('inconnu'))).toEqual(OPERATORS_BY_TYPE.text);
});

test('in / nin seulement quand multiOperator vaut in', () => {
  expect(values(getOperatorsForType('select', undefined, { multiOperator: 'in' }))).toEqual(['eq', 'neq', 'in', 'nin', 'empty', 'nempty']);
  expect(values(getOperatorsForType('text', undefined, { multiOperator: 'in' }))).not.toContain('in');
});

test('libellés français, variantes de date', () => {
  expect(operatorLabel('containsb', 'text')).toBe('commence par');
  expect(operatorLabel('between', 'date')).toBe('entre');
  expect(operatorLabel('gte', 'number')).toBe('supérieur ou égal à');
  expect(operatorLabel('gte', 'date')).toBe('à partir du');
  expect(operatorLabel('ltwe', 'datetime')).toBe('jusqu’au');
  expect(operatorLabel('empty', 'select')).toBe('est vide');
  expect(operatorLabel('zzz', 'text')).toBe('zzz');
});

test('tournures de la phrase en clair', () => {
  expect(operatorPhrase('between', 'date')).toBe('est entre');
  expect(operatorPhrase('eq', 'select')).toBe('est');
  expect(operatorPhrase('containsb', 'text')).toBe('commence par');
  expect(operatorPhrase('ltw', 'date')).toBe('est avant le');
  expect(operatorPhrase('gt', 'monetary')).toBe('est supérieur à');
});

test('les libellés passent par t', () => {
  const t = desc => (desc.id === 'rbf.filter.oper.eq' ? 'vaut' : desc.defaultMessage);
  expect(operatorLabel('eq', 'text', t)).toBe('vaut');
  expect(operatorLabel('neq', 'text', t)).toBe('n’est pas');
});

test('opérateurs d’un champ : sa liste d’abord, sinon son type', () => {
  expect(values(getFieldOperators({ type: 'text', operators: ['containsb', 'eq'] }))).toEqual(['containsb', 'eq']);
  expect(values(getFieldOperators({ type: 'select', multiOperator: 'in' }))).toContain('in');
  expect(values(getFieldOperators({ type: 'bool' }))).toEqual(['eq', 'empty', 'nempty']);
});

test('needsValue, isRange, opérateur par défaut', () => {
  expect(needsValue('empty')).toBe(false);
  expect(needsValue('nempty')).toBe(false);
  expect(needsValue('eq')).toBe(true);
  expect(isRange('between')).toBe(true);
  expect(isRange('gte')).toBe(false);
  expect(defaultOperatorForType('text')).toBe('contains');
  expect(defaultOperatorForType('select')).toBe('eq');
  expect(defaultOperatorForType('date')).toBe('between');
  expect(defaultOperatorForType('monetary')).toBe('between');
  expect(defaultOperatorForType('bool')).toBe('eq');
});
