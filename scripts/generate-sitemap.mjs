// Generates public/sitemap.xml from the route table + src/data/towns.js.
// Runs automatically before `npm run build` (see package.json "prebuild").
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { towns } from '../src/data/towns.js';

const SITE_URL = 'https://nicholasliappas.com';
const __dirname = dirname(fileURLToPath(import.meta.url));

const paths = ['/', '/home-valuation', '/privacy', '/terms', ...Object.values(towns).map((t) => `/${t.slug}`)];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`).join('\n')}
</urlset>
`;

const out = resolve(__dirname, '../public/sitemap.xml');
writeFileSync(out, xml);
console.log(`sitemap: wrote ${paths.length} URLs to public/sitemap.xml`);
