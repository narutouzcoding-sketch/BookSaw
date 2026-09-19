class StorageMock {
  constructor() { this.store = {}; }
  getItem(key) { return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null; }
  setItem(key, val) { this.store[key] = String(val); }
  removeItem(key) { delete this.store[key]; }
  clear() { this.store = {}; }
}

globalThis.localStorage = new StorageMock();
globalThis.sessionStorage = new StorageMock();

if (typeof globalThis.window === 'undefined' || !globalThis.window.addEventListener) {
  const win = new EventTarget();
  win.localStorage = globalThis.localStorage;
  win.sessionStorage = globalThis.sessionStorage;
  win.scrollTo = () => {};

  const elementsById = new Map();

  win.document = {
    querySelectorAll: () => [],
    querySelector: () => null,
    getElementById: (id) => elementsById.get(id) || null,
    addEventListener: () => {},
    removeEventListener: () => {},
    createElement: (tag) => {
      const el = {
        tagName: tag.toUpperCase(),
        className: '',
        _id: '',
        get id() { return this._id; },
        set id(val) { this._id = val; elementsById.set(val, this); },
        setAttribute: () => {},
        appendChild: () => {},
        classList: {
          _classes: new Set(),
          add(c) { this._classes.add(c); },
          remove(c) { this._classes.delete(c); },
          contains(c) { return this._classes.has(c); }
        },
        _childImg: { src: '', alt: '' },
        querySelector: (sel) => {
          if (sel === 'img') return el._childImg;
          return null;
        },
        addEventListener: () => {}
      };
      return el;
    },
    body: {
      dataset: {},
      appendChild: (child) => {
        if (child && child.id) elementsById.set(child.id, child);
      },
      classList: { add: () => {}, remove: () => {} }
    }
  };
  globalThis.window = win;
  globalThis.document = win.document;
}
