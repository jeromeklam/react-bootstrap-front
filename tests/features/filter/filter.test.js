import {
  Filter,
  FILTER_MODE_AND,
  FILTER_MODE_OR,
  FILTER_OPER_LIKE,
  FILTER_TYPE_GROUP,
  FILTER_TYPE_ELEM,
  FILTER_SEARCH_NONE,
  FILTER_OPER_GREATER_OR_EQUAL_OR_NULL,
  FILTER_OPER_EQUAL,
} from '../../../src/features/filter';

/**
 * empty filter
 */
test('empty Filter', () => {
  const myFilter = new Filter();
  expect(myFilter).toBeInstanceOf(Filter);
  expect(myFilter.data.filter).toEqual(FILTER_TYPE_GROUP);
  expect(myFilter.data.mode).toEqual(FILTER_MODE_OR);
  expect(myFilter.data.operator).toEqual(FILTER_OPER_LIKE);
  expect(myFilter.data.filters.length).toEqual(0);
  expect(myFilter.data.filter_crits.length).toEqual(0);
  expect(myFilter.data.filter_default).toBe(false);
  expect(myFilter.data.filter_enable).toBe(true);
  expect(myFilter.data.filter_fixed).toBe(false);
});

/**
 * simple filter
 */
test('simple Filter', () => {
  const myFilter = new Filter();
  myFilter.addFilter('field', 'val');
  expect(myFilter.data.filters.length).toBe(1);
  const elem = myFilter.data.filters[0];
  expect(elem).toBeInstanceOf(Filter);
});

/**
 * simple filter
 */
test('Double Filter', () => {
  const myFilter = new Filter();
  myFilter.setMode(FILTER_MODE_AND);
  myFilter.addFilter('cau_to', '2021-12-31', FILTER_OPER_GREATER_OR_EQUAL_OR_NULL, false, true);
  myFilter.addFilter('caut_id', 355, FILTER_OPER_EQUAL, true);
  expect(myFilter.data.filters.length).toBe(2);
});
