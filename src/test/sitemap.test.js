import { describe, it, expect } from 'vitest';
import { sitePaths } from '../../scripts/site-paths.mjs';

describe('sitemap paths', () => {
  it('includes /commercial alongside the town pages', () => {
    expect(sitePaths()).toContain('/commercial');
    expect(sitePaths()).toContain('/manhasset');
    expect(sitePaths()).toContain('/home-valuation');
  });
});
