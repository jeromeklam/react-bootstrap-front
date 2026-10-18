import React from 'react';
import renderer from 'react-test-renderer';
import { Col } from '../../../src/features/grid';

test('les props supplémentaires atteignent le div', () => {
  const tree = renderer.create(
    <Col size={{ xxs: 36, sm: 6 }} id="section-donateur" role="region" aria-labelledby="titre" data-test="x" textAlign="right" className="extra">
      <span>contenu</span>
    </Col>
  );
  const div = tree.root.findByType('div');
  expect(div.props.id).toBe('section-donateur');
  expect(div.props.role).toBe('region');
  expect(div.props['aria-labelledby']).toBe('titre');
  expect(div.props['data-test']).toBe('x');
  expect(div.props.className).toContain('col');
  expect(div.props.className).toContain('text-right');
  expect(div.props.className).toContain('extra');
  expect(div.props.size).toBeUndefined();
  expect(div.props.textAlign).toBeUndefined();
});
