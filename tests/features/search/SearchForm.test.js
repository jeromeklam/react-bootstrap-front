import React from 'react';
import { shallow } from 'enzyme';
import { Filter, FILTER_MODE_AND, FILTER_OPER_LIKE, FILTER_OPER_EQUAL } from '../../../src/features/filter';
import { Col } from '../../../src/features/grid';
import { SearchForm, SearchFormSection, SearchFormField, SearchFormFooter, SearchSummary, InputNaturalSearch } from '../../../src/features/search';
import { donorCatalog } from './fixtures';

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

const SECTIONS = [
  { name: 'donateur', label: 'Donateur', fields: ['cli_lastname', 'cli_town', 'cli_email'] },
  { name: 'categorie', label: 'Catégorie', fields: ['client_category.clic_id'], hint: 'Aucune cochée = toutes' },
  { name: 'paiement', label: 'Paiement', fields: ['donations.don_real_ts', 'donations.don_mnt_input', 'don_kind'] },
  { name: 'programme', label: 'Programme', fields: ['donations.cause.cause_type.caut_id', 'inconnu'] },
];
const icons = { calendar: <i />, clear: <i />, check: <i />, sparkle: <i className="sparkle" /> };

test('une section par entrée, champs du catalogue, pied avec la phrase', () => {
  const w = shallow(<SearchForm catalog={donorCatalog()} sections={SECTIONS} onSubmit={() => {}} icons={icons} subject="Donateurs" title="Rechercher des donateurs" />);
  const sections = w.find(SearchFormSection);
  expect(sections.length).toBe(4);
  expect(sections.at(0).prop('first')).toBe(true);
  expect(sections.at(1).prop('first')).toBe(false);
  expect(sections.at(1).prop('hint')).toBe('Aucune cochée = toutes');
  expect(sections.at(2).prop('fields')).toEqual(['donations.don_real_ts', 'donations.don_mnt_input', 'don_kind']);
  expect(w.find('h4').text()).toBe('Rechercher des donateurs');
  expect(w.find(SearchFormFooter).length).toBe(1);
  expect(w.find(SearchFormFooter).prop('summary').type).toBe(SearchSummary);
  expect(w.find(SearchFormFooter).prop('summary').props.withDefaults).toBe(true);
  /* La phrase suit l'ordre des sections, pas celui du catalogue. */
  expect(w.find(SearchFormFooter).prop('summary').props.catalog.slice(0, 3).map(f => f.name)).toEqual(['cli_lastname', 'cli_town', 'cli_email']);
  const quiet = shallow(<SearchForm catalog={donorCatalog()} sections={SECTIONS} onSubmit={() => {}} icons={icons} withDefaults={false} />);
  expect(quiet.find(SearchFormFooter).prop('summary').props.withDefaults).toBe(false);
  expect(w.find(InputNaturalSearch).length).toBe(0);
});

test('section : champs résolus, inconnu écarté avec avertissement, largeurs', () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const w = shallow(<SearchFormSection label="Programme" catalog={donorCatalog()} fields={['donations.cause.cause_type.caut_id', 'inconnu', 'don_kind']} values={{ don_kind: 'once' }} onChange={() => {}} />);
  const fields = w.find(SearchFormField);
  expect(fields.length).toBe(2);
  expect(fields.at(1).prop('value')).toBe('once');
  expect(warn).toHaveBeenCalled();
  warn.mockRestore();
  const stacked = shallow(
    <SearchFormSection
      label="Paiement"
      catalog={donorCatalog().map(f => (f.name === 'donations.don_mnt_input' || f.name === 'don_kind' ? { ...f, newLine: true } : f))}
      fields={['donations.don_real_ts', 'donations.don_mnt_input', 'don_kind']}
      onChange={() => {}}
    />
  );
  expect(stacked.find('.w-100').length).toBe(2);
  expect(stacked.find(SearchFormField).length).toBe(3);
  /* Squelette en flex pur ; les champs sur la grille, chaque colonne avec ses six tailles. */
  expect(stacked.find('.rbf-search-form-section-label-col').length).toBe(1);
  expect(stacked.find('.rbf-search-form-section-content').length).toBe(1);
  const sizes = stacked.find(Col).map(c => Object.keys(c.prop('size')).join(','));
  expect(sizes.length).toBe(3);
  expect(sizes.every(keys => keys === 'xxs,xs,sm,md,lg,xl')).toBe(true);
  expect(stacked.find(Col).at(0).prop('size')).toEqual({ xxs: 36, xs: 36, sm: 15, md: 15, lg: 15, xl: 15 });
  expect(stacked.find(Col).at(2).prop('size')).toEqual({ xxs: 36, xs: 36, sm: 'auto', md: 'auto', lg: 'auto', xl: 'auto' });
  const custom = shallow(<SearchFormSection label="Libre"><b>libre</b></SearchFormSection>);
  expect(custom.find(SearchFormField).length).toBe(0);
  expect(custom.find('b').text()).toBe('libre');
});

test('non contrôlée : saisie, soumission avec le filtre et les valeurs, effacement', () => {
  const onSubmit = jest.fn();
  const onClear = jest.fn();
  const base = new Filter();
  base.init(FILTER_MODE_AND, FILTER_OPER_LIKE);
  base.addFilter('group.id', 15, FILTER_OPER_EQUAL, true);
  const w = shallow(<SearchForm catalog={donorCatalog()} sections={SECTIONS} onSubmit={onSubmit} onClear={onClear} base={base} icons={icons} />);
  const change = w.find(SearchFormSection).at(0).prop('onChange');
  change({ target: { name: 'cli_lastname', value: 'Dupont' } });
  change({ target: { name: 'client_category.clic_id', value: [6] } });
  change({ target: { name: 'don_kind', value: 'regular' } });
  w.update();
  expect(w.find(SearchFormSection).at(0).prop('values')).toEqual({ cli_lastname: 'Dupont', 'client_category.clic_id': [6], don_kind: 'regular' });
  w.find('form').simulate('submit', { preventDefault() {} });
  expect(onSubmit).toHaveBeenCalledTimes(1);
  const [filter, values] = onSubmit.mock.calls[0];
  expect(values.cli_lastname).toBe('Dupont');
  expect(normalize(filter.asJsonApiObject())).toEqual({
    filter: {
      and: {
        cli_lastname: { contains: 'Dupont' },
        'client_category.clic_id': { eq: '6' },
        'donations.sponsorship.spo_id': { nempty: null },
        'group.id': { eq: '15' },
      },
    },
  });
  expect(base.hasFilter('cli_lastname')).toBe(false);
  w.find(SearchFormFooter).prop('onClear')();
  w.update();
  expect(w.find(SearchFormSection).at(0).prop('values')).toEqual({});
  expect(onClear).toHaveBeenCalled();
});

test('contrôlée : onChange reçoit les valeurs complètes', () => {
  const onChange = jest.fn();
  const w = shallow(<SearchForm catalog={donorCatalog()} sections={SECTIONS} onSubmit={() => {}} values={{ cli_town: 'Metz' }} onChange={onChange} icons={icons} />);
  w.find(SearchFormSection).at(0).prop('onChange')({ target: { name: 'cli_email', value: 'a@b.fr' } });
  expect(onChange).toHaveBeenCalledWith({ cli_town: 'Metz', cli_email: 'a@b.fr' });
  expect(w.find(SearchFormSection).at(0).prop('values')).toEqual({ cli_town: 'Metz' });
});

test('langage naturel : carte en construction, puis remplissage depuis un résultat', () => {
  const w = shallow(
    <SearchForm catalog={donorCatalog()} sections={SECTIONS} onSubmit={() => {}} icons={icons}
      naturalLanguage={{ placeholder: 'Décrivez', hint: 'Indication' }} advancedLink={{ onClick: () => {} }} />
  );
  const natural = w.find(InputNaturalSearch);
  expect(natural.length).toBe(1);
  expect(natural.prop('variant')).toBe('card');
  expect(natural.prop('sparkleIcon')).toBe(icons.sparkle);
  expect(natural.prop('hint')).toBe('Indication');
  expect(natural.prop('onNaturalLanguage')).toBeNull();
  expect(natural.prop('context').catalog[0].name).toBe('cli_lastname');
  expect(w.find('button.btn-link').first().text()).toBe('Critères avancés');
  natural.prop('onResult')({
    plain: { mode: 'AND', filters: [{ name: 'client_category.clic_id', operator: 'eq', values: [6] }, { name: 'donations.don_real_ts', operator: 'between', values: ['2025-01-01', '2025-12-31'] }] },
    warnings: ['« pour la forêt » non compris'],
  });
  w.update();
  expect(w.find(SearchFormSection).at(0).prop('values')).toEqual({ 'client_category.clic_id': [6], 'donations.don_real_ts': ['2025-01-01', '2025-12-31'] });
  expect(w.find(InputNaturalSearch).prop('hint')).toBe('Les critères ci-dessous ont été remplis depuis votre phrase. Vérifiez-les avant de lancer.');
  expect(w.find('li').map(li => li.text())).toEqual(['« pour la forêt » non compris']);
});
