import { useEffect } from 'react';

export const SITE_URL = 'https://nicholasliappas.com';

const MANAGED_ATTR = 'data-seo';

// Per-route <head> management. Every tag this hook touches is either
// restored to its previous value or removed on cleanup, so navigating
// between routes never leaves duplicate meta/canonical/JSON-LD behind.
//
//   useSeo({
//     title: 'Page title',
//     meta: [{ name: 'description', content: '...' }, { property: 'og:title', content: '...' }],
//     links: [{ rel: 'canonical', href: '...' }],
//     schemas: [{ '@context': 'https://schema.org', ... }],
//   });
export function useSeo(config) {
  const key = JSON.stringify(config);

  useEffect(() => {
    const { title, meta = [], links = [], schemas = [] } = JSON.parse(key);
    const head = document.head;
    const restore = [];

    if (title) {
      const previous = document.title;
      document.title = title;
      restore.push(() => { document.title = previous; });
    }

    const upsert = (tagName, matchAttrs, setAttrs) => {
      const selector = tagName + Object.entries(matchAttrs)
        .map(([k, v]) => `[${k}="${CSS.escape(v)}"]`).join('');
      const existing = head.querySelector(selector);
      if (existing) {
        const previous = Object.fromEntries(Object.keys(setAttrs).map((k) => [k, existing.getAttribute(k)]));
        Object.entries(setAttrs).forEach(([k, v]) => existing.setAttribute(k, v));
        restore.push(() => {
          Object.entries(previous).forEach(([k, v]) => (v === null ? existing.removeAttribute(k) : existing.setAttribute(k, v)));
        });
        return;
      }
      const el = document.createElement(tagName);
      Object.entries({ ...matchAttrs, ...setAttrs }).forEach(([k, v]) => el.setAttribute(k, v));
      el.setAttribute(MANAGED_ATTR, '');
      head.appendChild(el);
      restore.push(() => el.remove());
    };

    meta.forEach(({ content, ...match }) => upsert('meta', match, { content }));
    links.forEach(({ href, ...match }) => upsert('link', match, { href }));

    schemas.forEach((schema) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute(MANAGED_ATTR, '');
      script.text = JSON.stringify(schema);
      head.appendChild(script);
      restore.push(() => script.remove());
    });

    return () => restore.reverse().forEach((fn) => fn());
  }, [key]);
}

// Standard title/description/canonical/Open Graph/Twitter set for a route.
export function pageMeta({ title, description, path, ogType = 'website' }) {
  const url = SITE_URL + path;
  return {
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:type', content: ogType },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
    ],
    links: [{ rel: 'canonical', href: url }],
  };
}
