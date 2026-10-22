import React from 'react';
import renderer from 'react-test-renderer';
import { Flag, flagFile } from '../../../src/index';

test('un drapeau est une image servie par l’application, code à deux ou trois lettres', () => {
  expect(flagFile('fra')).toBe('fr');
  expect(flagFile('GB')).toBe('gb');
  expect(flagFile('de')).toBe('de');
  expect(flagFile('')).toBe('');
  const img = renderer.create(<Flag code="FRA" height={24} />).root.findByType('img');
  expect(img.props.src).toBe('/flags/fr.svg');
  expect(img.props.alt).toBe('fr');
  expect(img.props.style.height).toBe(24);
  const custom = renderer.create(<Flag code="gb" src={code => `/img/${code}.svg`} />).root.findByType('img');
  expect(custom.props.src).toBe('/img/gb.svg');
  expect(renderer.create(<Flag code="" />).toJSON()).toBeNull();
});
