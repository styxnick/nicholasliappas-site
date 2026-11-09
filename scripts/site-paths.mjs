// Every indexable route. Used by generate-sitemap.mjs (and tested).
import { towns } from '../src/data/towns.js';
import { guides } from '../src/data/guides.js';

export function sitePaths() {
  return ['/', '/home-valuation', '/moving-to-long-island', '/commercial', '/privacy', '/terms', ...Object.values(towns).map((t) => `/${t.slug}`), ...Object.values(guides).map((g) => `/${g.slug}/buyers-guide`)];
}
