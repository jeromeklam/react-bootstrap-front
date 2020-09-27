export default class Treeview {
  constructor(options = {}, data = []) {
    this.options = options;
    this.data = data;
    this.state = [];
    this.selected = -1;
    this.root = '';
    this.initiated = false;
    this.init();
  }

  init() {
    this.fields = {
      parent: this.options.parent || 'parent',
      position: this.options.position || 'position',
      left: this.options.left || 'left',
      right: this.options.right || 'right',
      level: this.options.level || 'level',
      label: this.options.label || 'label',
    };
    this.root = this.options.root || 'Racine';
  }

  isInitiated() {
    return this.initiated;
  }

  setData(data) {
    this.initiated = true;
    this.data = data;
  }

  setOptions(options) {
    this.options = options;
    this.init();
  }

  addLoading(id) {
    const found2 = this.state.find(elem => elem.id === id);
    if (found2) {
      found2.state = 1;
    } else {
      this.state.push({
        id,
        state: 1,
      });
    }
  }

  select(id) {
    this.selected = id;
  }

  toggle(id) {
    const found2 = this.state.find(elem => elem.id === id);
    if (found2) {
      if (found2.state > 0) {
        found2.state = 0;
      } else {
        found2.state = 2;
      }
    } else {
      this.state.push({
        id,
        state: 2,
      });
    }
  }

  addLoaded(id) {
    const found2 = this.state.find(elem => elem.id === id);
    if (found2) {
      found2.state = 2;
    } else {
      this.state.push({
        id,
        state: 2,
      });
    }
  }

  isLoaded(id) {
    const found = this.data.find(elem => elem.id === id);
    if (found) {
      const found2 = this.state.find(elem => elem.id === id);
      if (found2 && found2.state > 0) {
        return true;
      }
    }
    return false;
  }

  getSelected() {
    return this.selected;
  }

  getChildren(parentId = 0) {
    let children = [];
    this.data.forEach((elem) => {
      const parent = elem[this.fields.parent];
      if (parent) {
        const elemParentId = parent.id;
        if (elemParentId === parentId || (elemParentId === null && parentId === 0)) {
          let hasChildren = false;
          if (elem[this.fields.right] - elem[this.fields.left] > 1) {
            hasChildren = true;
          }
          const found2 = this.state.find(elem2 => elem.id === elem2.id);
          let elemStatus = 0;
          if (found2) {
            elemStatus = found2.state;
          }
          children.push({
            id: elem.id,
            label: elem[this.fields.label],
            children: hasChildren,
            status: elemStatus,
            node: elem,
          });
        }
      }
    });
    children.sort((a, b) => {
      if (a[this.fields.position] > b[this.fields.position]) {
        return 1;
      }
      if (a[this.fields.position] < b[this.fields.position]) {
        return -1;
      }
      return 0;
    });
    return children;
  }

  getRootNode() {
    return {
      id: 0,
      label: this.root,
      children: true,
      status: 2,
      node: null,
    };
  }
}
