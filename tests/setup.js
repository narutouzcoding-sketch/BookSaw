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
  win.document = {
    querySelectorAll: () => [],
    querySelector: () => null,
    getElementById: () => null,
    createElement: (tag) => ({
      tagName: tag.toUpperCase(),
      className: '',
      id: '',
      setAttribute: () => {},
      appendChild: () => {},
      classList: { add: () => {}, remove: () => {} }
    }),
    body: { appendChild: () => {}, classList: { add: () => {}, remove: () => {} } }
  };
  globalThis.window = win;
  globalThis.document = win.document;
}
