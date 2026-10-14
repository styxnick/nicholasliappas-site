// Every indexable route. Used by generate-sitemap.mjs (and tested).
import { towns } from '../src/data/towns.js';

export function sitePaths() {
  return ['/', '/home-valuation', '/commercial', '/privacy', '/terms', ...Object.values(towns).map((t) => `/${t.slug}`)];
}
