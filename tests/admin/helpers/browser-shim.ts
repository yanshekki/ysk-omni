/**
 * Minimal browser globals so admin modules load under Node/vitest (L1/L2).
 * L3 uses happy-dom which provides real DOM — still call installBrowserShim
 * for sessionStorage consistency when needed.
 */
const mem = new Map<string, string>();

function storageApi() {
  return {
    getItem: (k: string) => (mem.has(k) ? mem.get(k)! : null),
    setItem: (k: string, v: string) => {
      mem.set(k, String(v));
    },
    removeItem: (k: string) => {
      mem.delete(k);
    },
    clear: () => mem.clear(),
    key: (i: number) => [...mem.keys()][i] ?? null,
    get length() {
      return mem.size;
    },
  };
}

export function installBrowserShim(): void {
  const store = storageApi();

  if (typeof globalThis.sessionStorage === 'undefined') {
    Object.defineProperty(globalThis, 'sessionStorage', {
      value: store,
      configurable: true,
    });
  }

  if (typeof globalThis.localStorage === 'undefined') {
    Object.defineProperty(globalThis, 'localStorage', {
      value: store,
      configurable: true,
    });
  }

  if (typeof globalThis.navigator === 'undefined') {
    Object.defineProperty(globalThis, 'navigator', {
      value: { language: 'en-US', clipboard: { writeText: async () => {} } },
      configurable: true,
    });
  }

  if (typeof globalThis.location === 'undefined') {
    Object.defineProperty(globalThis, 'location', {
      value: {
        hash: '',
        href: 'http://localhost/admin/',
        pathname: '/admin/',
        search: '',
      },
      configurable: true,
      writable: true,
    });
  }

  if (typeof globalThis.history === 'undefined') {
    Object.defineProperty(globalThis, 'history', {
      value: {
        replaceState(_s: unknown, _t: string, url?: string) {
          if (url && String(url).startsWith('#')) {
            (globalThis.location as { hash: string }).hash = String(url);
          }
        },
      },
      configurable: true,
    });
  }

  if (typeof globalThis.document === 'undefined') {
    Object.defineProperty(globalThis, 'document', {
      value: {
        body: {
          classList: {
            add() {},
            remove() {},
            toggle() {},
            contains: () => false,
          },
        },
        getElementById: () => null,
        querySelector: () => null,
        querySelectorAll: () => [],
        createElement: () => ({
          style: {},
          classList: { add() {}, remove() {}, toggle() {} },
          setAttribute() {},
          appendChild() {},
          remove() {},
          addEventListener() {},
          querySelector: () => null,
          querySelectorAll: () => [],
        }),
        addEventListener() {},
        removeEventListener() {},
      },
      configurable: true,
    });
  }

  if (typeof globalThis.window === 'undefined') {
    Object.defineProperty(globalThis, 'window', {
      value: globalThis,
      configurable: true,
    });
  }
}

export function resetSessionStore(): void {
  mem.clear();
  try {
    sessionStorage.clear();
  } catch {
    /* ignore */
  }
  try {
    localStorage.clear();
  } catch {
    /* ignore */
  }
}
