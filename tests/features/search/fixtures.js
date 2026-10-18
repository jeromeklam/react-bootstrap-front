import { FILTER_OPER_EMPTY, FILTER_OPER_NOT_EMPTY } from '../../../src/features/filter';
import { normalizeCatalog } from '../../../src/features/search';

/* Un catalogue de donateurs, dans l'esprit de ce qu'admin construira depuis son
   getCols : les tournures des maquettes y sont déclarées. */
export const CATEGORIES = [
  { value: 1, label: 'Administration' },
  { value: 4, label: 'Entreprise' },
  { value: 6, label: 'Particulier' },
];
export const PAYMENT_TYPES = [
  { value: 3, label: 'CB' },
  { value: 5, label: 'Chèque' },
  { value: 14, label: 'Prélèvement' },
];
export const PROGRAMS = [
  { value: 10, label: 'Dulan' },
  { value: 11, label: 'Forêt' },
];
export const GROUPS = [
  { value: 15, label: 'Kalaweit France' },
  { value: 16, label: 'Kalaweit Belgique' },
];

export const donorCatalog = () =>
  normalizeCatalog([
    { name: 'cli_lastname', label: 'Nom', type: 'text', section: 'donateur', phrase: { label: 'le nom' } },
    { name: 'cli_town', label: 'Ville', type: 'text', section: 'donateur', defaultOperator: 'containsb', phrase: { label: 'la ville' } },
    { name: 'cli_email', label: 'E-mail', type: 'text', section: 'donateur' },
    {
      name: 'client_category.clic_id', label: 'Catégorie', type: 'select', options: CATEGORIES,
      section: 'categorie', widget: 'pills',
      phrase: { eq: 'de catégorie {value}' },
      subjectFor: values => (values.length === 1 && String(values[0]) === '6' ? 'Particuliers' : null),
    },
    {
      name: 'donations.don_real_ts', label: 'Paiement', type: 'date', section: 'paiement', widget: 'date-range',
      phrase: { between: 'ayant payé entre le {from} et le {to}' },
    },
    {
      name: 'last_donation.don_real_ts', label: 'Dernier paiement', type: 'date',
      phrase: { label: 'le dernier paiement' }, facet: { order: 30, kind: 'range' },
    },
    { name: 'donations.don_mnt_input', label: 'Montant', type: 'monetary', section: 'paiement', widget: 'amount-range' },
    {
      name: 'don_kind', virtual: true, label: 'Don', section: 'paiement', widget: 'segmented',
      options: [{ value: '', label: 'Tous' }, { value: 'regular', label: 'Régulier' }, { value: 'once', label: 'Ponctuel' }],
      fields: ['donations.sponsorship.spo_id'],
      toFilter: (value, filter) => {
        filter.removeFilter('donations.sponsorship.spo_id');
        if (value === 'regular') {
          filter.addFilter('donations.sponsorship.spo_id', null, FILTER_OPER_NOT_EMPTY);
        }
        if (value === 'once') {
          filter.addFilter('donations.sponsorship.spo_id', null, FILTER_OPER_EMPTY);
        }
      },
      fromFilter: filter => {
        const elt = filter.findFirst('donations.sponsorship.spo_id');
        if (!elt) {
          return '';
        }
        return elt.getOperator() === FILTER_OPER_NOT_EMPTY ? 'regular' : 'once';
      },
      toText: value => (value === 'regular' ? 'réguliers' : value === 'once' ? 'ponctuels' : ''),
    },
    {
      name: 'donations.payment_type.ptyp_id', label: 'Moyen de paiement', type: 'select', options: PAYMENT_TYPES,
      section: 'moyen', widget: 'pills', facet: { order: 10 },
      format: (value, field) => {
        const option = field.options.find(o => String(o.value) === String(value));
        return option ? option.label.toLowerCase() : String(value);
      },
      phrase: { eq: 'par {value}' },
    },
    {
      name: 'donations.cause.cause_type.caut_id', label: 'Programme', type: 'select', options: PROGRAMS,
      section: 'programme', widget: 'pills', phrase: { eq: 'pour le programme {value}' },
    },
    { name: 'sponsorships.spo_ts', label: 'Ami', type: 'date', section: 'ami', widget: 'date-range', phrase: { label: 'l’enregistrement comme ami' } },
    { name: 'donations.grp_id', label: 'Association', type: 'select', options: GROUPS, multiple: false, phrase: { eq: 'rattachés à {value}' } },
    { name: 'cli_receipt', label: 'Reçu fiscal', type: 'bool', phrase: { label: 'le reçu fiscal' } },
  ]);
