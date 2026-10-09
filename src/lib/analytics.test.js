import { describe, it, expect } from 'vitest';
import { deriveAttribution, pageContext } from './analytics';

const derive = (over = {}) => deriveAttribution({
  pathname: '/',
  search: '',
  referrer: '',
  hostname: 'nicholasliappas.com',
  ...over,
});

describe('deriveAttribution source and medium from referrer', () => {
  it('maps instagram.com and l.instagram.com to instagram/social', () => {
    expect(derive({ referrer: 'https://www.instagram.com/' })).toMatchObject({ source: 'instagram', medium: 'social' });
    expect(derive({ referrer: 'https://l.instagram.com/?u=x' })).toMatchObject({ source: 'instagram', medium: 'social' });
  });

  it('maps any google domain to google/organic', () => {
    expect(derive({ referrer: 'https://www.google.com/' })).toMatchObject({ source: 'google', medium: 'organic' });
    expect(derive({ referrer: 'https://www.google.co.uk/' })).toMatchObject({ source: 'google', medium: 'organic' });
  });

  it('maps facebook, linkedin, and x to social', () => {
    expect(derive({ referrer: 'https://l.facebook.com/' })).toMatchObject({ source: 'facebook', medium: 'social' });
    expect(derive({ referrer: 'https://www.linkedin.com/feed' })).toMatchObject({ source: 'linkedin', medium: 'social' });
    expect(derive({ referrer: 'https://lnkd.in/abc' })).toMatchObject({ source: 'linkedin', medium: 'social' });
    expect(derive({ referrer: 'https://t.co/abc' })).toMatchObject({ source: 'x', medium: 'social' });
    expect(derive({ referrer: 'https://x.com/nick' })).toMatchObject({ source: 'x', medium: 'social' });
  });

  it('maps compass.com to compass/referral', () => {
    expect(derive({ referrer: 'https://www.compass.com/agents/x' })).toMatchObject({ source: 'compass', medium: 'referral' });
  });

  it('treats an empty referrer as direct/none', () => {
    expect(derive({ referrer: '' })).toMatchObject({ source: 'direct', medium: 'none' });
  });

  it('treats a same-host referrer as direct/none', () => {
    expect(derive({ referrer: 'https://nicholasliappas.com/manhasset' })).toMatchObject({ source: 'direct', medium: 'none' });
  });

  it('uses the bare host with medium referral for unknown referrers', () => {
    expect(derive({ referrer: 'https://www.zillow.com/profile/x' })).toMatchObject({ source: 'zillow.com', medium: 'referral' });
  });

  it('treats an unparseable referrer as direct', () => {
    expect(derive({ referrer: 'not a url' })).toMatchObject({ source: 'direct', medium: 'none' });
  });
});

describe('deriveAttribution UTM override', () => {
  it('prefers utm_source, utm_medium and utm_campaign over the referrer', () => {
    const r = derive({ referrer: 'https://www.google.com/', search: '?utm_source=newsletter&utm_medium=email&utm_campaign=fall-open-house' });
    expect(r).toMatchObject({ source: 'newsletter', medium: 'email', campaign: 'fall-open-house' });
  });

  it('lowercases and trims utm values', () => {
    expect(derive({ search: '?utm_source=%20Instagram%20&utm_medium=Social' })).toMatchObject({ source: 'instagram', medium: 'social' });
  });

  it('falls back to the referrer medium when only utm_source is given', () => {
    expect(derive({ referrer: 'https://www.instagram.com/', search: '?utm_source=bio' })).toMatchObject({ source: 'bio', medium: 'social' });
  });

  it('leaves campaign empty when absent', () => {
    expect(derive().campaign).toBe('');
  });
});

describe('deriveAttribution landing page and raw referrer', () => {
  it('records the landing pathname and the raw referrer string', () => {
    const r = derive({ pathname: '/port-washington', referrer: 'https://www.instagram.com/' });
    expect(r.landing_page).toBe('/port-washington');
    expect(r.referrer).toBe('https://www.instagram.com/');
  });

  it('returns exactly the five attribution fields', () => {
    expect(Object.keys(derive()).sort()).toEqual(['campaign', 'landing_page', 'medium', 'referrer', 'source']);
  });
});

describe('pageContext', () => {
  it('classifies the home page', () => {
    expect(pageContext('/')).toEqual({ page_type: 'home', town: '' });
  });

  it('classifies a town page with its slug', () => {
    expect(pageContext('/port-washington')).toEqual({ page_type: 'town', town: 'port-washington' });
  });

  it('classifies a buyers guide with its town slug', () => {
    expect(pageContext('/manhasset/buyers-guide')).toEqual({ page_type: 'buyers_guide', town: 'manhasset' });
  });

  it('classifies the valuation and legal pages', () => {
    expect(pageContext('/home-valuation')).toEqual({ page_type: 'valuation', town: '' });
    expect(pageContext('/privacy')).toEqual({ page_type: 'legal', town: '' });
    expect(pageContext('/terms')).toEqual({ page_type: 'legal', town: '' });
  });

  it('classifies unknown slugs as not_found with no town', () => {
    expect(pageContext('/nowhere')).toEqual({ page_type: 'not_found', town: '' });
    expect(pageContext('/nowhere/buyers-guide')).toEqual({ page_type: 'not_found', town: '' });
  });

  it('ignores a trailing slash', () => {
    expect(pageContext('/roslyn/')).toEqual({ page_type: 'town', town: 'roslyn' });
  });
});
