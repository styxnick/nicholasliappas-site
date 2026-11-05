import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render } from '../entry-server.jsx';
import { buildDocument, mergeSeo, outputPath } from '../../scripts/prerender.mjs';
import { sitePaths } from '../../scripts/site-paths.mjs';

const template = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
const routes = sitePaths();

describe('server render', () => {
  it.each(routes)('%s renders a page with an <h1> and a title', (route) => {
    const { html, seo } = render(route);
    expect(html).toMatch(/<h1[\s>]/);
    expect(html).not.toContain('undefined');
    expect(mergeSeo(seo).title).toBeTruthy();
  });

  it('renders the nav with both breakpoint variants in the markup', () => {
    const { html } = render('/manhasset');
    expect(html).toContain('class="nav-desktop"');
    expect(html).toContain('class="nav-mobile"');
  });

  it('does not put the hero video in the static home page', () => {
    expect(render('/').html).not.toContain('<video');
    expect(render('/').html).toContain('colonial-home-loop-poster.jpg');
  });

  it('renders the 404 page for unknown urls with noindex', () => {
    const { html, seo } = render('/__prerender__/not-found');
    expect(html).toContain('Page Not Found');
    expect(mergeSeo(seo).meta).toContainEqual({ name: 'robots', content: 'noindex' });
  });
});

describe('buildDocument', () => {
  const { html, seo } = render('/manhasset');
  const doc = buildDocument(template, html, seo);

  it('puts the markup inside #root', () => {
    expect(doc).toMatch(/<div id="root"><div/);
    expect(doc).toContain('Manhasset Real Estate');
  });

  it('writes the route title, description, canonical and open graph tags once each', () => {
    expect(doc.match(/<title>/g)).toHaveLength(1);
    expect(doc).toMatch(/<title>Manhasset Real Estate \| Homes for Sale \| Nicholas Liappas<\/title>/);
    expect(doc.match(/<meta name="description"/g)).toHaveLength(1);
    expect(doc.match(/<link rel="canonical"/g)).toHaveLength(1);
    expect(doc).toContain('<link rel="canonical" href="https://nicholasliappas.com/manhasset" data-seo-ssr />');
    expect(doc.match(/<meta property="og:title"/g)).toHaveLength(1);
    expect(doc.match(/<meta property="og:type"/g)).toHaveLength(1);
  });

  it('inlines the JSON-LD the page declares, marked for the client to take over', () => {
    const scripts = doc.match(/<script type="application\/ld\+json" data-seo-ssr>[^<]*<\/script>/g) || [];
    expect(scripts.length).toBeGreaterThan(0);
    expect(JSON.parse(scripts[0].replace(/<[^>]+>/g, ''))['@context']).toBe('https://schema.org');
  });

  it('escapes title and meta content', () => {
    const out = buildDocument(template, '<p>x</p>', [{ title: 'A "q" <b>', meta: [{ name: 'description', content: 'd & "e"' }] }]);
    expect(out).toContain('<title>A &quot;q&quot; &lt;b&gt;</title>');
    expect(out).toContain('<meta name="description" content="d &amp; &quot;e&quot;" />');
  });

  it('maps routes to flat html files so Netlify serves them without a trailing slash', () => {
    expect(outputPath('/d', '/')).toBe('/d/index.html');
    expect(outputPath('/d', '/manhasset')).toBe('/d/manhasset.html');
    expect(outputPath('/d', '/home-valuation')).toBe('/d/home-valuation.html');
  });
});
