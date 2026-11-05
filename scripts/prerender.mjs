// Build-time prerender. Runs after `vite build` (see package.json "build"):
// renders every route in scripts/site-paths.mjs through src/entry-server.jsx
// and writes dist/<route>/index.html with the page markup in #root and the
// route's title/meta/canonical/JSON-LD in <head>. Unknown URLs get dist/404.html
// (served with a real 404 by netlify.toml).
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { sitePaths } from './site-paths.mjs';

const SSR_ATTR = 'data-seo-ssr';
const NOT_FOUND_URL = '/__prerender__/not-found';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const parseAttrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));

// Replace the `content` of an existing <meta> in the shell whose other
// attributes match, or append a new one marked as prerendered.
function upsertMeta(html, match, content) {
  const re = /<meta\s[^>]*>/g;
  let replaced = false;
  const out = html.replace(re, (tag) => {
    if (replaced) return tag;
    const attrs = parseAttrs(tag);
    if (!Object.entries(match).every(([k, v]) => attrs[k] === v)) return tag;
    replaced = true;
    return `<meta ${Object.entries(match).map(([k, v]) => `${k}="${esc(v)}"`).join(' ')} content="${esc(content)}" />`;
  });
  if (replaced) return out;
  const tag = `<meta ${Object.entries(match).map(([k, v]) => `${k}="${esc(v)}"`).join(' ')} content="${esc(content)}" ${SSR_ATTR} />`;
  return out.replace('</head>', `    ${tag}\n  </head>`);
}

// Fold the useSeo configs a route rendered (outermost first) into one head.
export function mergeSeo(configs) {
  const merged = { title: null, meta: [], links: [], schemas: [] };
  const metaKey = ({ content, ...match }) => JSON.stringify(match);
  const linkKey = ({ href, ...match }) => JSON.stringify(match);
  for (const c of configs) {
    if (!c) continue;
    if (c.title) merged.title = c.title;
    for (const m of c.meta || []) {
      merged.meta = merged.meta.filter((x) => metaKey(x) !== metaKey(m)).concat(m);
    }
    for (const l of c.links || []) {
      merged.links = merged.links.filter((x) => linkKey(x) !== linkKey(l)).concat(l);
    }
    merged.schemas.push(...(c.schemas || []));
  }
  return merged;
}

export function buildDocument(template, html, seoConfigs) {
  const seo = mergeSeo(seoConfigs);
  let out = template;
  if (!out.includes('<div id="root"></div>')) throw new Error('template has no empty #root');
  out = out.replace('<div id="root"></div>', `<div id="root">${html}</div>`);
  if (seo.title) out = out.replace(/<title>[^<]*<\/title>/, `<title>${esc(seo.title)}</title>`);
  for (const { content, ...match } of seo.meta) out = upsertMeta(out, match, content);
  const extra = [];
  for (const { href, ...match } of seo.links) {
    extra.push(`<link ${Object.entries(match).map(([k, v]) => `${k}="${esc(v)}"`).join(' ')} href="${esc(href)}" ${SSR_ATTR} />`);
  }
  for (const schema of seo.schemas) {
    extra.push(`<script type="application/ld+json" ${SSR_ATTR}>${JSON.stringify(schema).replace(/<\//g, '<\\/')}</script>`);
  }
  if (extra.length) out = out.replace('</head>', `    ${extra.join('\n    ')}\n  </head>`);
  return out;
}

export function outputPath(dist, route) {
  return route === '/' ? join(dist, 'index.html') : join(dist, route.replace(/^\//, ''), 'index.html');
}

async function main() {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const dist = join(root, 'dist');
  const ssrDir = join(root, 'dist-ssr');
  const template = readFileSync(join(dist, 'index.html'), 'utf8');
  const { render } = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href);

  const routes = sitePaths();
  for (const route of routes) {
    const { html, seo } = render(route);
    if (!/<h1[\s>]/.test(html)) throw new Error(`prerender: ${route} rendered without an <h1>`);
    const file = outputPath(dist, route);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, buildDocument(template, html, seo));
  }
  const nf = render(NOT_FOUND_URL);
  if (!/Page Not Found/.test(nf.html)) throw new Error('prerender: 404 page did not render');
  writeFileSync(join(dist, '404.html'), buildDocument(template, nf.html, nf.seo));

  if (existsSync(ssrDir)) rmSync(ssrDir, { recursive: true, force: true });
  console.log(`prerender: wrote ${routes.length} routes + 404.html to dist/`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => { console.error(err); process.exit(1); });
}
