import React from 'react';
import { shallow } from 'enzyme';
import DefaultHeader from '../../../src/features/list/DefaultHeader';
import { Filter, FILTER_MODE_AND, FILTER_OPER_LIKE, FILTER_OPER_EQUAL } from '../../../src/features/filter';

const filters = () => {
  const f = new Filter();
  f.init(FILTER_MODE_AND, FILTER_OPER_LIKE);
  f.addFilter('group.id', 15, FILTER_OPER_EQUAL, true);
  f.addFilter('cli_town', 'Metz', FILTER_OPER_LIKE);
  f.addFilter('cli_lastname', 'Dupont', FILTER_OPER_LIKE);
  return f;
};
const header = props =>
  shallow(<DefaultHeader title="Donateurs" cols={[]} onToggleFilter={() => {}} filters={filters()} toolbar={<div className="ma-barre" />} toolbarIcon={<i className="tune" />} {...props} />);

test('repliée par défaut : 50 px, pas de rangée, bouton avec le nombre de critères', () => {
  const w = header({});
  expect(w.find('.rbf-list-header-toolbar').length).toBe(0);
  expect(w.prop('style').height).toBe('50px');
  const toggle = w.find('.rbf-list-header-toolbar-toggle');
  expect(toggle.length).toBe(1);
  expect(toggle.prop('aria-expanded')).toBe(false);
  expect(toggle.prop('title')).toBe('Afficher les critères');
  expect(toggle.find('.badge').text()).toBe('2');
});

test('ouverte : 94 px, la rangée porte la barre, plus de badge', () => {
  const onToolbarToggle = jest.fn();
  const w = header({ toolbarOpen: true, onToolbarToggle });
  expect(w.prop('style').height).toBe('94px');
  const row = w.find('.rbf-list-header-toolbar');
  expect(row.prop('style').height).toBe('44px');
  expect(row.find('.ma-barre').length).toBe(1);
  const toggle = w.find('.rbf-list-header-toolbar-toggle');
  expect(toggle.prop('aria-expanded')).toBe(true);
  expect(toggle.prop('title')).toBe('Masquer les critères');
  expect(toggle.find('.badge').length).toBe(0);
  toggle.simulate('click');
  expect(onToolbarToggle).toHaveBeenCalled();
});

test('sans toolbar : rien ne change ; toolbarCount explicite ; texte d’action globale', () => {
  const plain = shallow(<DefaultHeader title="Donateurs" cols={[]} onToggleFilter={() => {}} filters={filters()} globalActions={[{ name: 'add', label: 'Ajouter', icon: <i />, text: 'Donateur', theme: 'primary', onClick: () => {} }]} />);
  expect(plain.find('.rbf-list-header-toolbar-toggle').length).toBe(0);
  expect(plain.prop('style').height).toBe('50px');
  expect(plain.find('.nav-item button').last().text()).toContain('Donateur');
  const counted = header({ toolbarCount: 7, toolbarHeight: 60, toolbarOpen: true });
  expect(counted.prop('style').height).toBe('110px');
  expect(header({ toolbarCount: 0 }).find('.badge').length).toBe(0);
});
