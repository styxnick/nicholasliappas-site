import { describe, it, expect, beforeEach, vi } from 'vitest';

// Each test gets a fresh module instance so module-level state cannot leak.
async function load() {
  vi.resetModules();
  return import('./analytics');
}

const at = (url, referrer = '') => ({ location: new URL(url), referrer });
const PROD = 'https://nicholasliappas.com';

// gtag pushes `arguments` objects onto dataLayer; flatten for assertions.
const calls = () => (window.dataLayer || []).map((a) => Array.from(a));
const events = (name) => calls().filter((c) => c[0] === 'event' && c[1] === name).map((c) => c[2]);

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  delete window.dataLayer;
  delete window.gtag;
  document.head.querySelectorAll('script').forEach((s) => s.remove());
});

describe('first-touch attribution', () => {
  it('is empty strings before init', async () => {
    const m = await load();
    expect(m.getAttribution()).toEqual({ landing_page: '', source: '', medium: '', campaign: '', referrer_url: '' });
  });

  it('is derived on init and exposed by getAttribution', async () => {
    const m = await load();
    m.initAnalytics(at(`${PROD}/port-washington?utm_campaign=fall`, 'https://www.instagram.com/'));
    expect(m.getAttribution()).toEqual({
      landing_page: '/port-washington', source: 'instagram', medium: 'social', campaign: 'fall', referrer_url: 'https://www.instagram.com/',
    });
  });

  it('is written once per session and not overwritten by a later init', async () => {
    let m = await load();
    m.initAnalytics(at(`${PROD}/manhasset`, 'https://www.google.com/'));
    m = await load();
    m.initAnalytics(at(`${PROD}/roslyn`, 'https://www.facebook.com/'));
    expect(m.getAttribution()).toMatchObject({ landing_page: '/manhasset', source: 'google' });
  });

  it('falls back to memory when sessionStorage throws', async () => {
    const m = await load();
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    expect(() => m.initAnalytics(at(`${PROD}/manhasset`, 'https://www.google.com/'))).not.toThrow();
    expect(m.getAttribution()).toMatchObject({ landing_page: '/manhasset', source: 'google' });
    spy.mockRestore();
    vi.restoreAllMocks();
  });
});

describe('internal traffic flag', () => {
  it('is off on production with no query flag', async () => {
    const m = await load();
    m.initAnalytics(at(`${PROD}/`));
    expect(m.isInternal()).toBe(false);
  });

  it('is set by ?internal=1 and persists for later visits', async () => {
    let m = await load();
    m.initAnalytics(at(`${PROD}/?internal=1`));
    expect(m.isInternal()).toBe(true);
    m = await load();
    m.initAnalytics(at(`${PROD}/`));
    expect(m.isInternal()).toBe(true);
  });

  it('is cleared by ?internal=0', async () => {
    let m = await load();
    m.initAnalytics(at(`${PROD}/?internal=1`));
    m = await load();
    m.initAnalytics(at(`${PROD}/?internal=0`));
    expect(m.isInternal()).toBe(false);
  });

  it('is set automatically on localhost and netlify.app previews', async () => {
    let m = await load();
    m.initAnalytics(at('http://localhost:5173/'));
    expect(m.isInternal()).toBe(true);
    window.localStorage.clear();
    m = await load();
    m.initAnalytics(at('https://deploy-preview-12--nicholaswebsite.netlify.app/'));
    expect(m.isInternal()).toBe(true);
  });

  it('survives localStorage throwing', async () => {
    const m = await load();
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    expect(() => m.initAnalytics(at(`${PROD}/?internal=1`))).not.toThrow();
    expect(m.isInternal()).toBe(true);
    vi.restoreAllMocks();
  });
});

describe('gtag wiring', () => {
  it('configures GA4 without automatic page views', async () => {
    const m = await load();
    m.initAnalytics(at(`${PROD}/`));
    const config = calls().find((c) => c[0] === 'config');
    expect(config[1]).toBe(m.GA_MEASUREMENT_ID);
    expect(config[2]).toMatchObject({ send_page_view: false });
    expect(config[2]).not.toHaveProperty('traffic_type');
  });

  it('marks the config as internal traffic when the flag is set', async () => {
    const m = await load();
    m.initAnalytics(at(`${PROD}/?internal=1`));
    const config = calls().find((c) => c[0] === 'config');
    expect(config[2]).toMatchObject({ traffic_type: 'internal' });
  });

  it('loads the gtag script once even if init is called twice', async () => {
    const m = await load();
    m.initAnalytics(at(`${PROD}/`));
    m.initAnalytics(at(`${PROD}/`));
    expect(document.head.querySelectorAll('script[src*="googletagmanager"]').length).toBe(1);
  });
});

describe('track', () => {
  it('sends the event with its own params plus page and source context', async () => {
    const m = await load();
    m.initAnalytics(at(`${PROD}/manhasset`, 'https://www.instagram.com/'));
    window.history.replaceState({}, '', '/manhasset');
    m.track('phone_click', { placement: 'hero' });
    expect(events('phone_click')).toEqual([{ placement: 'hero', page_type: 'town', town: 'manhasset', first_source: 'instagram' }]);
  });

  it('derives page context from the current location at call time, not init time', async () => {
    const m = await load();
    m.initAnalytics(at(`${PROD}/`));
    window.history.replaceState({}, '', '/roslyn/buyers-guide');
    m.track('generate_lead', { form_name: 'buyers-guide' });
    expect(events('generate_lead')[0]).toMatchObject({ page_type: 'buyers_guide', town: 'roslyn' });
  });

  it('adds traffic_type only when internal', async () => {
    let m = await load();
    m.initAnalytics(at(`${PROD}/`));
    m.track('cta_click', { cta: 'schedule' });
    expect(events('cta_click')[0]).not.toHaveProperty('traffic_type');
    m = await load();
    m.initAnalytics(at(`${PROD}/?internal=1`));
    m.track('cta_click', { cta: 'schedule' });
    expect(events('cta_click').at(-1)).toMatchObject({ traffic_type: 'internal' });
  });

  it('does nothing before init instead of throwing', async () => {
    const m = await load();
    expect(() => m.track('cta_click', { cta: 'schedule' })).not.toThrow();
  });
});

describe('trackPageView', () => {
  it('sends page_view with path, title and context', async () => {
    const m = await load();
    m.initAnalytics(at(`${PROD}/`));
    window.history.replaceState({}, '', '/port-washington');
    document.title = 'Port Washington | Nicholas Liappas';
    m.trackPageView('/port-washington');
    expect(events('page_view')).toEqual([{
      page_path: '/port-washington',
      page_location: window.location.href,
      page_title: 'Port Washington | Nicholas Liappas',
      page_type: 'town',
      town: 'port-washington',
      first_source: 'direct',
    }]);
  });
});
