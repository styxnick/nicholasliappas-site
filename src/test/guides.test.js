import { describe, it, expect } from 'vitest';
import { guides, guideForTown } from '../data/guides.js';
import { towns } from '../data/towns.js';

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
});
