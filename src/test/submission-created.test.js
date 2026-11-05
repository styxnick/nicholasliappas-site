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

describe('submission-created sends', () => {
  const full = () => payload({ name: 'Jane Doe', email: 'jane@example.com', phone: '5165551212', interest: 'buying', landing_page: '/', source: 'direct', medium: 'none', campaign: '', referrer_url: '' });

  it('sends the alert first, then a confirmation to the lead', async () => {
    await handler({ json: async () => ({ payload: full() }) });
    const calls = fetch.mock.calls.map(([url, init]) => [url, JSON.parse(init.body)]);
    expect(calls).toHaveLength(2);
    expect(calls[0][1].to).toEqual(['nicholas.liappas@compass.com']);
    expect(calls[0][1].subject).toBe('New lead · Jane Doe · Buying a Home');
    expect(calls[1][1].to).toEqual(['jane@example.com']);
    expect(calls[1][1].from).toBe('Nicholas Liappas <nicholas@nicholasliappas.com>');
  });

  it('adds LEAD_ALERT_TO recipients to the alert only', async () => {
    process.env.LEAD_ALERT_TO = 'a@example.com, b@example.com';
    await handler({ json: async () => ({ payload: full() }) });
    delete process.env.LEAD_ALERT_TO;
    const [alert, confirmation] = fetch.mock.calls.map(([, init]) => JSON.parse(init.body));
    expect(alert.to).toEqual(['nicholas.liappas@compass.com', 'a@example.com', 'b@example.com']);
    expect(confirmation.to).toEqual(['jane@example.com']);
  });

  it('still returns 200 when the confirmation fails', async () => {
    let n = 0;
    vi.stubGlobal('fetch', vi.fn(async () => (++n === 1 ? { ok: true, text: async () => '{"id":"1"}' } : { ok: false, status: 422, text: async () => 'bad' })));
    const res = await handler({ json: async () => ({ payload: full() }) });
    expect(res.status).toBe(200);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('returns 502 and sends nothing else when the alert fails', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 500, text: async () => 'down' })));
    const res = await handler({ json: async () => ({ payload: full() }) });
    expect(res.status).toBe(502);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('skips the confirmation when the lead left no email', async () => {
    await handler({ json: async () => ({ payload: payload({ name: 'Jane Doe', phone: '5165551212', interest: 'buying' }, { email: undefined }) }) });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('pushes a first-name-only note to ntfy when NTFY_TOPIC is set', async () => {
    process.env.NTFY_TOPIC = 'test-topic';
    await handler({ json: async () => ({ payload: full() }) });
    delete process.env.NTFY_TOPIC;
    const push = fetch.mock.calls.find(([url]) => String(url).startsWith('https://ntfy.sh/'));
    expect(push[0]).toBe('https://ntfy.sh/test-topic');
    expect(push[1].body).toBe('New lead · Jane · Buying a Home');
    expect(push[1].body).not.toContain('Doe');
  });
});
