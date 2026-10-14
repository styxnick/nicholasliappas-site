// Node 22+ ships an experimental `localStorage` global that shadows jsdom's and
// has no working methods unless --localstorage-file is set. Replace the Web
// Storage globals with a working jsdom implementation so tests behave the same
// on every Node version. Both storages share one Storage prototype so
// `vi.spyOn(Storage.prototype, ...)` affects both.
import { JSDOM } from 'jsdom';

const { window: w } = new JSDOM('', { url: 'http://localhost:3000' });
for (const key of ['localStorage', 'sessionStorage', 'Storage']) {
  Object.defineProperty(globalThis, key, { value: w[key], configurable: true, writable: true });
}
