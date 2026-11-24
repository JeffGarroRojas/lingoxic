import "@testing-library/jest-dom";

// Node 26 expone `localStorage` experimental como undefined y tapa el de jsdom.
if (!globalThis.localStorage) {
  const store = new Map();
  Object.defineProperty(globalThis, "localStorage", {
    value: {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k),
      clear: () => store.clear(),
      key: (i) => [...store.keys()][i] ?? null,
      get length() {
        return store.size;
      },
    },
    configurable: true,
  });
}

class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.IntersectionObserver = MockIntersectionObserver;

global.matchMedia = global.matchMedia || (() => ({
  matches: false,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
}));
