// Per-route social/SEO meta, shared by the React head hook (client) and the
// Netlify edge function (server) so crawlers that don't run JS still get the
// right title, description, canonical and preview image.
//
// Plain ESM with explicit extensions so Deno (edge) and Vite (client/test)
// both resolve it.
import { towns } from '../data/towns.js';
import { seo as commercialSeo } from '../data/commercial.js';

export const SITE_URL = 'https://nicholasliappas.com';
const DEFAULT_IMAGE = `${SITE_URL}/nicholas-headshot.jpg`;

const STATIC = {
  '/': {
    title: 'Nicholas Liappas | Compass Real Estate Agent | North Shore, Queens & North Fork',
    description: 'Nicholas Liappas is a Licensed Associate Real Estate Broker at Compass specializing in residential, commercial, and development sales across Long Island\'s North Shore, Queens, and the North Fork. Built Different, Sold Better.',
  },
  '/home-valuation': {
    title: 'Free Home Valuation | Nicholas Liappas | Compass Real Estate',
    description: 'Get a free, no-obligation home valuation for your North Shore property. Nicholas Liappas at Compass provides personalized Comparative Market Analysis (CMA) for Manhasset, Port Washington, Roslyn, and more.',
  },
  '/commercial': {
    title: commercialSeo.title,
    description: commercialSeo.description,
    image: `${SITE_URL}/commercial/hero.jpg`,
  },
};

export function routeMeta(pathname) {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  let entry = STATIC[path];
  if (!entry) {
    const slug = path.slice(1);
    const town = towns[slug];
    if (town) entry = { title: town.title, description: town.metaDescription };
  }
  if (!entry) return null;
  return {
    title: entry.title,
    description: entry.description,
    url: SITE_URL + (path === '/' ? '/' : path),
    image: entry.image || DEFAULT_IMAGE,
  };
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const metaTag = (attr, key, value) => `<meta ${attr}="${key}" content="${esc(value)}" />`;

// Rewrite the shell HTML's head for one route. Replaces the tags index.html
// already carries and appends the per-route ones.
export function injectMeta(html, meta) {
  if (!meta) return html;
  let out = html
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(meta.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>/, metaTag('name', 'description', meta.description))
    .replace(/<meta property="og:image" content="[^"]*"\s*\/?>/, metaTag('property', 'og:image', meta.image))
    .replace(/<meta name="twitter:image" content="[^"]*"\s*\/?>/, metaTag('name', 'twitter:image', meta.image));
  const extra = [
    metaTag('property', 'og:title', meta.title),
    metaTag('property', 'og:description', meta.description),
    metaTag('property', 'og:url', meta.url),
    metaTag('name', 'twitter:title', meta.title),
    metaTag('name', 'twitter:description', meta.description),
    `<link rel="canonical" href="${esc(meta.url)}" />`,
  ].join('\n    ');
  return out.replace('</head>', `    ${extra}\n  </head>`);
}
