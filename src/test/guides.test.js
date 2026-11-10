import { describe, it, expect } from 'vitest';
import { guides, guideForTown } from '../data/guides.js';
import { towns } from '../data/towns.js';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const PUBLIC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../public');

describe('guides', () => {
  it('resolve a shared guide for alias towns', () => {
    expect(guideForTown('roslyn').slug).toBe('roslyn');
    expect(guideForTown('east-hills').slug).toBe('roslyn');
    expect(guideForTown('glen-head')).toBeNull();
  });

  it('only reference real town slugs', () => {
    for (const g of Object.values(guides)) {
      expect(towns[g.slug], g.slug).toBeTruthy();
      for (const a of g.alsoFor || []) expect(towns[a], a).toBeTruthy();
    }
  });

  it('keep ampersands out of copy except proper names', () => {
    const text = JSON.stringify(guides);
    const amps = [...text.matchAll(/[A-Za-z]+ & [A-Za-z]+/g)].map((m) => m[0]);
    expect(amps.filter((a) => !/^(Bryant & Cooper|Science & the)$/.test(a))).toEqual([]);
  });

  it('ship every hero photo they reference', () => {
    for (const g of Object.values(guides)) {
      if (!g.hero) continue;
      expect(g.hero.alt, `${g.slug} hero alt`).toBeTruthy();
      for (const base of [g.hero.src, g.hero.small].filter(Boolean)) {
        for (const ext of ['webp', 'jpg']) expect(existsSync(path.join(PUBLIC, `${base}.${ext}`)), `${base}.${ext}`).toBe(true);
      }
    }
  });
});
