import { describe, it, expect } from 'vitest';
import { routeMeta, injectMeta } from '../lib/routeMeta.js';

const SHELL = `<html><head><title>Default Title</title>
<meta name="description" content="Default description" />
<meta property="og:site_name" content="Site" />
<meta property="og:type" content="website" />
<meta property="og:image" content="https://nicholasliappas.com/nicholas-headshot.jpg" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="https://nicholasliappas.com/nicholas-headshot.jpg" />
</head><body></body></html>`;

describe('routeMeta', () => {
  it('returns commercial page meta', () => {
    const m = routeMeta('/commercial');
    expect(m.title).toMatch(/^Commercial Real Estate Broker/);
    expect(m.url).toBe('https://nicholasliappas.com/commercial');
    expect(m.image).toBe('https://nicholasliappas.com/commercial/hero.jpg');
  });

  it('returns town page meta from towns.js', () => {
    const m = routeMeta('/port-washington');
    expect(m.title).toMatch(/Port Washington/);
    expect(m.url).toBe('https://nicholasliappas.com/port-washington');
  });

  it('returns valuation and home meta', () => {
    expect(routeMeta('/home-valuation').url).toBe('https://nicholasliappas.com/home-valuation');
    expect(routeMeta('/').url).toBe('https://nicholasliappas.com/');
  });

  it('returns null for unknown routes and asset paths', () => {
    expect(routeMeta('/nowhere')).toBeNull();
    expect(routeMeta('/assets/index-abc.js')).toBeNull();
  });

  it('ignores a trailing slash', () => {
    expect(routeMeta('/commercial/').url).toBe('https://nicholasliappas.com/commercial');
  });
});

describe('injectMeta', () => {
  const out = injectMeta(SHELL, routeMeta('/commercial'));

  it('replaces the title and description', () => {
    expect(out).toContain('<title>Commercial Real Estate Broker');
    expect(out).not.toContain('Default Title');
    expect(out).toMatch(/<meta name="description" content="Commercial sales and leasing/);
  });

  it('adds og:title, og:description, og:url and canonical', () => {
    expect(out).toMatch(/<meta property="og:title" content="Commercial Real Estate Broker/);
    expect(out).toMatch(/<meta property="og:url" content="https:\/\/nicholasliappas\.com\/commercial"/);
    expect(out).toMatch(/<link rel="canonical" href="https:\/\/nicholasliappas\.com\/commercial"/);
  });

  it('swaps og:image and twitter:image for the route image', () => {
    expect(out).toMatch(/<meta property="og:image" content="https:\/\/nicholasliappas\.com\/commercial\/hero\.jpg"/);
    expect(out).toMatch(/<meta name="twitter:image" content="https:\/\/nicholasliappas\.com\/commercial\/hero\.jpg"/);
    expect(out).not.toContain('nicholas-headshot.jpg');
  });

  it('escapes quotes and angle brackets in content', () => {
    const o = injectMeta(SHELL, { title: 'A "quoted" <b>', description: 'x', url: 'https://x/', image: 'https://x/i.jpg' });
    expect(o).toContain('<title>A &quot;quoted&quot; &lt;b&gt;</title>');
    expect(o).toContain('content="A &quot;quoted&quot; &lt;b&gt;"');
  });

  it('returns the html unchanged when meta is null', () => {
    expect(injectMeta(SHELL, null)).toBe(SHELL);
  });
});
