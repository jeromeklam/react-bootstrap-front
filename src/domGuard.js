/**
 * Garde posée avant tout le reste du bundle.
 *
 * trello-smooth-dnd (le glisser-déposer du tableau) embarque un vieux polyfill qui lit
 * `Node.prototype.firstElementChild` sur le prototype lui-même avant d'y poser un
 * getter fondé sur `this.childNodes`. Si ce code s'exécute deux fois dans la même
 * page (deux exemplaires, ou jsdom dans les tests d'une application), la seconde
 * lecture appelle le getter avec le prototype pour `this` : « TypeError: Illegal
 * invocation », et le bundle entier refuse de se charger.
 *
 * On pose d'abord un getter qui répond `false` (ni null ni undefined : le polyfill
 * n'insiste pas) quand on le lit sur le prototype, et le premier enfant élément
 * sur un vrai nœud. Dans les navigateurs, Element, Document et DocumentFragment
 * ont déjà le leur, plus spécifique : rien ne change pour eux.
 */
export const guardFirstElementChild = (root = typeof window !== 'undefined' ? window : null) => {
  const NodeClass = root && (root.Node || root.Element);
  const proto = NodeClass && NodeClass.prototype;
  if (!proto || Object.prototype.hasOwnProperty.call(proto, 'firstElementChild')) {
    return false;
  }
  Object.defineProperty(proto, 'firstElementChild', {
    configurable: true,
    get() {
      if (this === proto || !this || !this.childNodes) {
        return false;
      }
      const nodes = this.childNodes;
      for (let i = 0; i < nodes.length; i += 1) {
        if (nodes[i].nodeType === 1) {
          return nodes[i];
        }
      }
      return null;
    },
  });
  return true;
};

guardFirstElementChild();
