import { describe, it, expect, beforeEach, vi } from 'vitest';

async function load() {
  vi.resetModules();
  const analytics = await import('./analytics');
  const forms = await import('./netlifyForms');
  return { analytics, forms };
}

const body = () => Object.fromEntries(new URLSearchParams(fetch.mock.calls[0][1].body));

beforeEach(() => {
  window.sessionStorage.clear();
  window.localStorage.clear();
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true })));
});

describe('submitNetlifyForm attribution', () => {
  it('spreads the five first-touch fields into every submission', async () => {
    const { analytics, forms } = await load();
    analytics.initAnalytics({
      location: new URL('https://nicholasliappas.com/manhasset?utm_campaign=spring'),
      referrer: 'https://www.instagram.com/',
    });
    await forms.submitNetlifyForm('contact', { name: 'A', email: 'a@b.c', 'bot-field': '' });
    expect(body()).toMatchObject({
      'form-name': 'contact', name: 'A', email: 'a@b.c',
      landing_page: '/manhasset', source: 'instagram', medium: 'social', campaign: 'spring', referrer_url: 'https://www.instagram.com/',
    });
  });

  it('sends empty attribution strings when analytics was never initialised', async () => {
    const { forms } = await load();
    await forms.submitNetlifyForm('contact', { name: 'A', 'bot-field': '' });
    expect(body()).toMatchObject({ landing_page: '', source: '', medium: '', campaign: '', referrer_url: '' });
  });

  it('does not let caller fields overwrite attribution', async () => {
    const { analytics, forms } = await load();
    analytics.initAnalytics({ location: new URL('https://nicholasliappas.com/'), referrer: '' });
    await forms.submitNetlifyForm('contact', { source: 'spoof', 'bot-field': '' });
    expect(body().source).toBe('direct');
  });

  it('still sends nothing when the honeypot is filled', async () => {
    const { forms } = await load();
    await forms.submitNetlifyForm('contact', { name: 'bot', 'bot-field': 'x' });
    expect(fetch).not.toHaveBeenCalled();
  });
});
