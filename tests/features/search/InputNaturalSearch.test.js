import React from 'react';
import renderer from 'react-test-renderer';
import { InputNaturalSearch } from '../../../src/features/search';

jest.useFakeTimers();

const sparkle = <i className="sparkle" />;
const buttons = tree => tree.root.findAllByType('button');
const input = tree => tree.root.findByType('input');
const notices = tree => tree.root.findAllByProps({ role: 'status' }).map(n => n.children.join(''));
const type = (tree, text) => renderer.act(() => input(tree).props.onChange({ target: { value: text } }));

test('sans service : en construction, l’étincelle affiche la notice puis l’efface', () => {
  const onComingSoon = jest.fn();
  const tree = renderer.create(<InputNaturalSearch sparkleIcon={sparkle} onComingSoon={onComingSoon} />);
  type(tree, 'donateurs réguliers');
  expect(notices(tree)).toEqual([]);
  renderer.act(() => buttons(tree)[0].props.onClick());
  expect(notices(tree)).toEqual(['Recherche en langage naturel : en construction pour l’instant']);
  expect(onComingSoon).toHaveBeenCalledWith('donateurs réguliers');
  renderer.act(() => jest.advanceTimersByTime(4000));
  expect(notices(tree)).toEqual([]);
});

test('barre : Entrée garde la recherche rapide, sans notice ; indication « Entrée » en badge', () => {
  const onQuickSearch = jest.fn();
  const tree = renderer.create(<InputNaturalSearch sparkleIcon={sparkle} onQuickSearch={onQuickSearch} />);
  type(tree, 'dupont');
  renderer.act(() => tree.root.findByType('form').props.onSubmit({ preventDefault() {} }));
  expect(onQuickSearch).toHaveBeenCalledWith('dupont', 'simple');
  expect(notices(tree)).toEqual([]);
  const badge = tree.root.find(n => typeof n.props.className === 'string' && n.props.className.includes('badge'));
  expect(badge.children).toEqual(['Entrée']);
  const hidden = renderer.create(<InputNaturalSearch sparkleIcon={sparkle} kbdHint={false} />);
  expect(hidden.root.findAll(n => typeof n.props.className === 'string' && n.props.className.includes('badge')).length).toBe(0);
});

test('avec un service : attente, puis onResult avec le résultat et la phrase', async () => {
  let resolve;
  const onNaturalLanguage = jest.fn(() => new Promise(r => { resolve = r; }));
  const onResult = jest.fn();
  const tree = renderer.create(
    <InputNaturalSearch sparkleIcon={sparkle} onNaturalLanguage={onNaturalLanguage} onResult={onResult} context={{ locale: 'fr' }} />
  );
  type(tree, 'particuliers par chèque');
  renderer.act(() => tree.root.findByType('form').props.onSubmit());
  expect(onNaturalLanguage).toHaveBeenCalledWith('particuliers par chèque', { locale: 'fr', phrase: 'particuliers par chèque' });
  await renderer.act(async () => {
    await Promise.resolve();
  });
  expect(input(tree).props.disabled).toBe(true);
  await renderer.act(async () => {
    resolve({ plain: { filters: [] }, warnings: ['x'] });
    await Promise.resolve();
  });
  expect(onResult).toHaveBeenCalledWith({ plain: { filters: [] }, warnings: ['x'] }, 'particuliers par chèque');
  expect(input(tree).props.disabled).toBe(false);
});

test('service en erreur : notice et onError ; phrase vide ignorée', async () => {
  const onNaturalLanguage = jest.fn(() => Promise.reject(new Error('boom')));
  const onError = jest.fn();
  const tree = renderer.create(<InputNaturalSearch sparkleIcon={sparkle} onNaturalLanguage={onNaturalLanguage} onError={onError} />);
  renderer.act(() => buttons(tree)[0].props.onClick());
  expect(onNaturalLanguage).not.toHaveBeenCalled();
  type(tree, 'quelque chose');
  await renderer.act(async () => {
    buttons(tree)[0].props.onClick();
    await Promise.resolve();
    await Promise.resolve();
  });
  expect(onError).toHaveBeenCalled();
  expect(onError.mock.calls[0][0].message).toBe('boom');
  expect(notices(tree)).toEqual(['L’interprétation de la phrase a échoué']);
});

test('carte : bouton « Remplir les critères », indication, valeur contrôlée', () => {
  const onChange = jest.fn();
  const tree = renderer.create(
    <InputNaturalSearch
      variant="card"
      sparkleIcon={sparkle}
      value="particuliers qui ont donné par chèque"
      onChange={onChange}
      hint="Vérifiez-les avant de lancer."
      placeholder="Décrivez les donateurs recherchés"
    />
  );
  const labels = buttons(tree).map(b => b.children.join(''));
  expect(labels[1]).toBe('Remplir les critères');
  expect(input(tree).props.value).toBe('particuliers qui ont donné par chèque');
  expect(input(tree).props.placeholder).toBe('Décrivez les donateurs recherchés');
  expect(tree.root.findAllByType('small').map(n => n.children.join(''))).toEqual(['Vérifiez-les avant de lancer.']);
  type(tree, 'autre');
  expect(onChange).toHaveBeenCalledWith({ target: { name: 'natural', value: 'autre' } });
  renderer.act(() => buttons(tree)[1].props.onClick());
  expect(notices(tree).length).toBe(1);
});

test('comingSoon forcé malgré un service ; message personnalisé', () => {
  const onNaturalLanguage = jest.fn();
  const tree = renderer.create(
    <InputNaturalSearch sparkleIcon={sparkle} onNaturalLanguage={onNaturalLanguage} comingSoon comingSoonMessage="Bientôt." />
  );
  type(tree, 'x');
  renderer.act(() => buttons(tree)[0].props.onClick());
  expect(onNaturalLanguage).not.toHaveBeenCalled();
  expect(notices(tree)).toEqual(['Bientôt.']);
});

test('en attente : texte sous le champ ; puis les avertissements du résultat, effacés à la demande suivante', async () => {
  let resolve;
  const onNaturalLanguage = jest.fn(() => new Promise(r => { resolve = r; }));
  const tree = renderer.create(<InputNaturalSearch sparkleIcon={sparkle} onNaturalLanguage={onNaturalLanguage} />);
  type(tree, 'ponctuels en anglais');
  renderer.act(() => tree.root.findByType('form').props.onSubmit());
  await renderer.act(async () => {
    await Promise.resolve();
  });
  expect(notices(tree)).toEqual(['Analyse de la phrase en cours, quelques secondes…']);
  await renderer.act(async () => {
    resolve({ warnings: ['Non compris : « en anglais »', 'Nom : un seul critère retenu'] });
    await Promise.resolve();
  });
  expect(notices(tree)).toEqual([]);
  expect(tree.root.findAllByType('li').map(n => n.children.join(''))).toEqual(['Non compris : « en anglais »', 'Nom : un seul critère retenu']);
  renderer.act(() => tree.root.findByType('form').props.onSubmit());
  expect(tree.root.findAllByType('li').length).toBe(0);
  const silent = renderer.create(<InputNaturalSearch sparkleIcon={sparkle} onNaturalLanguage={() => Promise.resolve({ warnings: ['x'] })} showWarnings={false} />);
  type(silent, 'a');
  await renderer.act(async () => {
    silent.root.findByType('form').props.onSubmit();
    await Promise.resolve();
    await Promise.resolve();
  });
  expect(silent.root.findAllByType('li').length).toBe(0);
});
