import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { FONT_SANS, FONT_SERIF, FONT_MONO } from '../components/styles';

const root = process.cwd();
const walk = (dir) => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  return statSync(p).isDirectory() ? walk(p) : /\.(jsx?|mjs)$/.test(n) && !/\.test\./.test(n) ? [p] : [];
});
const sources = walk(resolve(root, 'src')).map((p) => [p.replace(root + '/', ''), readFileSync(p, 'utf8')]);
const indexHtml = readFileSync(resolve(root, 'index.html'), 'utf8');

describe('font tokens', () => {
  it('define Inter for sans, Newsreader for serif and IBM Plex Mono for details', () => {
    expect(FONT_SANS).toMatch(/^'Inter'/);
    expect(FONT_SANS).toMatch(/sans-serif$/);
    expect(FONT_SERIF).toMatch(/^'Newsreader'/);
    expect(FONT_MONO).toMatch(/^'IBM Plex Mono'/);
    expect(FONT_MONO).toMatch(/monospace$/);
  });

  it('retired families (Montserrat, Cormorant Garamond) appear nowhere in src or index.html', () => {
    for (const family of ['Montserrat', 'Cormorant Garamond']) {
      const hits = sources.filter(([, s]) => s.includes(family)).map(([f]) => f);
      expect(hits, family).toEqual([]);
      expect(indexHtml).not.toContain(family);
    }
  });

  it('no file other than styles.js hard-codes a font family string', () => {
    const hits = sources
      .filter(([f]) => !f.endsWith('components/styles.js'))
      .filter(([, s]) => /'(Inter|Newsreader|IBM Plex Mono)'/.test(s))
      .map(([f]) => f);
    expect(hits).toEqual([]);
  });

  it('index.html self-hosts Inter, Newsreader and IBM Plex Mono (no Google Fonts request)', () => {
    expect(indexHtml).not.toMatch(/fonts\.googleapis\.com|fonts\.gstatic\.com/);
    for (const file of ['newsreader-latin.woff2', 'inter-latin.woff2', 'ibm-plex-mono-latin.woff2']) {
      expect(statSync(resolve(root, 'public/fonts', file)).size).toBeGreaterThan(10_000);
      expect(indexHtml).toContain(`url('/fonts/${file}') format('woff2')`);
    }
    const faces = indexHtml.match(/@font-face \{[^}]+\}/g) || [];
    expect(faces).toHaveLength(3);
    for (const face of faces) expect(face).toContain('font-display: swap');
    expect(faces.filter((f) => f.includes("'Newsreader'"))).toHaveLength(1);
    expect(faces.filter((f) => f.includes("'Inter'"))).toHaveLength(1);
    expect(faces.filter((f) => f.includes("'IBM Plex Mono'"))).toHaveLength(1);
    // Serif and sans are above the fold on every page and preloaded; the mono is not.
    expect(indexHtml).toContain('<link rel="preload" as="font" type="font/woff2" href="/fonts/newsreader-latin.woff2" crossorigin />');
    expect(indexHtml).toContain('<link rel="preload" as="font" type="font/woff2" href="/fonts/inter-latin.woff2" crossorigin />');
    expect(indexHtml).not.toContain('href="/fonts/ibm-plex-mono-latin.woff2" crossorigin />');
  });
});
