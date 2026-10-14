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

  it('index.html loads Inter 400-700 and Cormorant Garamond with display=swap', () => {
    const link = indexHtml.match(/https:\/\/fonts\.googleapis\.com\/css2\?[^"]+/)[0];
    expect(link).toContain('family=Inter:wght@400;500;600;700');
    expect(link).toContain('family=Cormorant+Garamond:wght@300;400;500;600');
    expect(link).toContain('display=swap');
    expect(indexHtml).toContain('rel="preconnect" href="https://fonts.gstatic.com"');
  });
});
