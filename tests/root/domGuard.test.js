import { guardFirstElementChild } from '../../src/domGuard';

/* Le polyfill tel qu'il est dans le bundle : lecture sur le prototype, puis getter
   fondé sur this.childNodes. Évalué deux fois, sans garde, la seconde lecture
   appelle le getter avec le prototype pour this et jsdom jette Illegal invocation. */
const legacyPolyfill = e => {
  if (e && e.prototype && e.prototype.firstElementChild == null) {
    Object.defineProperty(e.prototype, 'firstElementChild', {
      configurable: true,
      get() {
        for (let i = 0, t = this.childNodes, n; (n = t[i++]); ) {
          if (n.nodeType === 1) return n;
        }
        return null;
      },
    });
  }
};

test('sans garde : le polyfill évalué deux fois casse jsdom ; avec la garde, il passe et firstElementChild reste juste', () => {
  const Fake = function() {};
  Fake.prototype = Object.create(Object.getPrototypeOf(document.createElement('div')).constructor.prototype);
  /* Un prototype vierge qui jette comme jsdom quand childNodes est lu sur lui. */
  const proto = {};
  Object.defineProperty(proto, 'childNodes', {
    configurable: true,
    get() {
      if (this === proto) throw new TypeError('Illegal invocation');
      return this._children || [];
    },
  });
  const Bare = function() {};
  Bare.prototype = proto;
  legacyPolyfill(Bare);
  expect(() => legacyPolyfill(Bare)).toThrow('Illegal invocation');

  const Guarded = function() {};
  const gproto = {};
  Object.defineProperty(gproto, 'childNodes', { configurable: true, get() { if (this === gproto) throw new TypeError('Illegal invocation'); return this._children || []; } });
  Guarded.prototype = gproto;
  expect(guardFirstElementChild({ Node: Guarded })).toBe(true);
  expect(() => legacyPolyfill(Guarded)).not.toThrow();
  expect(() => legacyPolyfill(Guarded)).not.toThrow();
  const node = new Guarded();
  node._children = [{ nodeType: 3 }, { nodeType: 1, name: 'premier' }, { nodeType: 1, name: 'second' }];
  expect(node.firstElementChild.name).toBe('premier');
  expect(new Guarded().firstElementChild).toBeNull();
  /* Déjà présent en propre : on ne touche à rien. */
  expect(guardFirstElementChild({ Node: Guarded })).toBe(false);
  /* Dans jsdom lui-même, la garde est posée par l'import et un vrai élément répond juste. */
  const div = document.createElement('div');
  div.appendChild(document.createTextNode('x'));
  const span = div.appendChild(document.createElement('span'));
  expect(div.firstElementChild).toBe(span);
  expect(Fake).toBeTruthy();
});
