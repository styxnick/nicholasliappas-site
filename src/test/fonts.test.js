import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { FONT_SANS, FONT_SERIF } from '../components/styles';

const root = process.cwd();
const walk = (dir) => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  return statSync(p).isDirectory() ? walk(p) : /\.(jsx?|mjs)$/.test(n) && !/\.test\./.test(n) ? [p] : [];
});
const sources = walk(resolve(root, 'src')).map((p) => [p.replace(root + '/', ''), readFileSync(p, 'utf8')]);
const indexHtml = readFileSync(resolve(root, 'index.html'), 'utf8');

describe('font tokens', () => {
  it('define Inter for sans and Cormorant Garamond for serif', () => {
    expect(FONT_SANS).toMatch(/^'Inter'/);
    expect(FONT_SANS).toMatch(/sans-serif$/);
    expect(FONT_SERIF).toMatch(/^'Cormorant Garamond'/);
  });

  it('Montserrat appears nowhere in src or index.html', () => {
    const hits = sources.filter(([, s]) => s.includes('Montserrat')).map(([f]) => f);
    expect(hits).toEqual([]);
    expect(indexHtml).not.toContain('Montserrat');
  });

  it('no file other than styles.js hard-codes a font family string', () => {
    const hits = sources
      .filter(([f]) => !f.endsWith('components/styles.js'))
      .filter(([, s]) => /'(Inter|Cormorant Garamond)'/.test(s))
      .map(([f]) => f);
    expect(hits).toEqual([]);
  });

  it('index.html self-hosts Inter and Cormorant Garamond (no Google Fonts request)', () => {
    expect(indexHtml).not.toMatch(/fonts\.googleapis\.com|fonts\.gstatic\.com/);
    for (const file of ['cormorant-garamond-latin.woff2', 'inter-latin.woff2']) {
      expect(statSync(resolve(root, 'public/fonts', file)).size).toBeGreaterThan(10_000);
      expect(indexHtml).toContain(`url('/fonts/${file}') format('woff2')`);
    }
    const faces = indexHtml.match(/@font-face \{[^}]+\}/g) || [];
    expect(faces).toHaveLength(2);
    for (const face of faces) expect(face).toContain('font-display: swap');
    expect(faces.filter((f) => f.includes("'Cormorant Garamond'"))).toHaveLength(1);
    expect(faces.filter((f) => f.includes("'Inter'"))).toHaveLength(1);
    // Both faces are above the fold on every page, so both are preloaded.
    expect(indexHtml).toContain('<link rel="preload" as="font" type="font/woff2" href="/fonts/cormorant-garamond-latin.woff2" crossorigin />');
    expect(indexHtml).toContain('<link rel="preload" as="font" type="font/woff2" href="/fonts/inter-latin.woff2" crossorigin />');
  });
});
