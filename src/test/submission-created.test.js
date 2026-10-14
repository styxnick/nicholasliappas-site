import { describe, it, expect, beforeEach, vi } from 'vitest';
import handler from '../../netlify/functions/submission-created.js';

const payload = (data, extra = {}) => ({
  form_name: 'contact',
  created_at: '2026-10-09T12:00:00Z',
  name: 'Jane Doe',
  email: 'jane@example.com',
  data,
  ordered_human_fields: Object.entries(data).map(([name, value]) => ({ name, title: name, value })),
  ...extra,
});

const run = async (p) => {
  const req = { json: async () => ({ payload: p }) };
  await handler(req);
  return JSON.parse(fetch.mock.calls[0][1].body);
};

beforeEach(() => {
  process.env.RESEND_API_KEY = 'test';
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, text: async () => '' })));
});

describe('submission-created attribution block', () => {
  it('renders the five attribution fields in the text and html email', async () => {
    const mail = await run(payload({
      name: 'Jane Doe', email: 'jane@example.com',
      landing_page: '/manhasset', source: 'instagram', medium: 'social', campaign: 'spring', referrer_url: 'https://www.instagram.com/',
    }));
    expect(mail.text).toContain('Attribution');
    expect(mail.text).toMatch(/Landing page: \/manhasset/);
    expect(mail.text).toMatch(/Source: instagram \(social\)/);
    expect(mail.text).toMatch(/Campaign: spring/);
    expect(mail.text).toMatch(/Referrer: https:\/\/www\.instagram\.com\//);
    expect(mail.html).toContain('Attribution');
    expect(mail.html).toContain('/manhasset');
  });

  it('keeps attribution out of the form-field list', async () => {
    const mail = await run(payload({ name: 'Jane Doe', landing_page: '/', source: 'direct', medium: 'none', campaign: '', referrer_url: '' }));
    const fieldSection = mail.text.split('Attribution')[0];
    expect(fieldSection).not.toMatch(/landing_page|source:/i);
  });

  it('shows dashes for missing attribution on legacy submissions', async () => {
    const mail = await run(payload({ name: 'Jane Doe' }));
    expect(mail.text).toMatch(/Landing page: —/);
    expect(mail.text).toMatch(/Source: —/);
  });
});
