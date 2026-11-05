import { describe, it, expect, vi, beforeEach } from 'vitest';
import { canaryFormBody, evaluateCanary, failureEmail, isCanary, CANARY_EMAIL, MAX_AGE_MS } from '../../netlify/lib/canary.js';

describe('canary helpers', () => {
  it('recognises the canary by its email only', () => {
    expect(isCanary({ email: CANARY_EMAIL })).toBe(true);
    expect(isCanary({ email: 'NLIAPPAS+CANARY@gmail.com' })).toBe(true);
    expect(isCanary({ email: 'nliappas@gmail.com' })).toBe(false);
  });

  it('posts the contact form with every mirror-form field and obvious attribution', () => {
    const p = new URLSearchParams(canaryFormBody(new Date('2026-11-10T12:00:00Z')));
    expect(p.get('form-name')).toBe('contact');
    expect(p.get('name')).toBe('Canary Check 2026-11-10T12:00Z');
    expect(p.get('email')).toBe(CANARY_EMAIL);
    expect(p.get('interest')).toBe('buying');
    expect(p.get('bot-field')).toBe('');
    for (const f of ['landing_page', 'source', 'medium', 'campaign', 'referrer_url']) expect(p.has(f)).toBe(true);
    expect(p.get('source')).toBe('canary');
  });
});

describe('evaluateCanary', () => {
  const now = new Date('2026-11-10T12:30:00Z');
  const pending = { submittedAt: '2026-11-10T12:00:00Z', submitStatus: 200 };
  const latest = { submittedAt: '2026-11-10T12:00:03Z', processedAt: '2026-11-10T12:00:05Z', alertId: 'a1', confirmationId: 'c1' };

  it('passes when the submission was processed and both emails delivered', () => {
    expect(evaluateCanary({ pending, latest, statuses: { a1: 'delivered', c1: 'delivered' }, now })).toEqual({ ok: true, reasons: [] });
  });

  it('fails when nothing was submitted', () => {
    const r = evaluateCanary({ pending: null, latest, now });
    expect(r.ok).toBe(false);
    expect(r.reasons[0]).toMatch(/No pending record/);
  });

  it('fails when the submission never reached the function', () => {
    const r = evaluateCanary({ pending, latest: { ...latest, processedAt: '2026-11-03T12:00:05Z' }, now });
    expect(r.ok).toBe(false);
    expect(r.reasons.join()).toMatch(/never reached submission-created/);
    expect(evaluateCanary({ pending, latest: null, now }).ok).toBe(false);
  });

  it('fails on a non-200 form POST and on a stale pending record', () => {
    expect(evaluateCanary({ pending: { ...pending, submitStatus: 404 }, latest, statuses: { a1: 'delivered', c1: 'delivered' }, now }).reasons.join()).toMatch(/HTTP 404/);
    const old = new Date(now - MAX_AGE_MS - 1000).toISOString();
    const r = evaluateCanary({ pending: { submittedAt: old, submitStatus: 200 }, latest: { ...latest, processedAt: old }, statuses: { a1: 'delivered', c1: 'delivered' }, now });
    expect(r.ok).toBe(false);
    expect(r.reasons.join()).toMatch(/stale/);
  });

  it('fails when either email was not delivered, naming which', () => {
    const r = evaluateCanary({ pending, latest, statuses: { a1: 'delivered', c1: 'bounced' }, now });
    expect(r.ok).toBe(false);
    expect(r.reasons).toEqual(['Confirmation to the lead: Resend reports "bounced".']);
    const s = evaluateCanary({ pending, latest, statuses: { a1: 'sent', c1: 'delivered' }, now });
    expect(s.reasons[0]).toMatch(/Alert to Nicholas: Resend reports "sent" 30 minutes after sending/);
    const m = evaluateCanary({ pending, latest: { ...latest, confirmationId: null }, statuses: { a1: 'delivered' }, now });
    expect(m.reasons[0]).toMatch(/Confirmation to the lead: no Resend id/);
  });
});

describe('failureEmail', () => {
  it('lists the reasons and where to look, addressed to Nicholas', () => {
    const m = failureEmail({ reasons: ['A broke', 'B <broke>'], pending: { submittedAt: 'x' }, latest: null, statuses: {} }, { from: 'f', to: ['n@c.com'] });
    expect(m.to).toEqual(['n@c.com']);
    expect(m.subject).toMatch(/FAILED — 2 problems/);
    expect(m.text).toContain('• A broke');
    expect(m.html).toContain('B &lt;broke&gt;');
    expect(m.text).toContain('app.netlify.com/projects/nicholaswebsite/forms');
  });
});

describe('canary-check function', () => {
  const blobs = new Map();
  beforeEach(() => {
    blobs.clear();
    vi.resetModules();
    vi.doMock('@netlify/blobs', () => ({ getStore: () => ({ get: async (k) => blobs.get(k) ?? null, setJSON: async (k, v) => { blobs.set(k, v); } }) }));
    process.env.RESEND_API_KEY = 'test';
  });

  it('emails Nicholas when delivery failed, and stays quiet when all is well', async () => {
    blobs.set('pending', { submittedAt: new Date(Date.now() - 60_000).toISOString(), submitStatus: 200 });
    blobs.set('latest', { processedAt: new Date().toISOString(), alertId: 'a1', confirmationId: 'c1' });
    const calls = [];
    vi.stubGlobal('fetch', vi.fn(async (url, init) => {
      calls.push([String(url), init]);
      if (String(url).includes('/emails/a1')) return { ok: true, json: async () => ({ last_event: 'delivered' }) };
      if (String(url).includes('/emails/c1')) return { ok: true, json: async () => ({ last_event: 'bounced' }) };
      return { ok: true, text: async () => '{}', json: async () => ({}) };
    }));
    const { default: check } = await import('../../netlify/functions/canary-check.mjs');
    const res = await check();
    expect(res.status).toBe(500);
    const sent = calls.find(([u, i]) => u === 'https://api.resend.com/emails' && i?.method === 'POST');
    const body = JSON.parse(sent[1].body);
    expect(body.to).toEqual(['nicholas.liappas@compass.com']);
    expect(body.text).toContain('Confirmation to the lead: Resend reports "bounced"');
    expect(blobs.get('last-check').ok).toBe(false);

    calls.length = 0;
    vi.stubGlobal('fetch', vi.fn(async (url) => { calls.push([String(url)]); return { ok: true, json: async () => ({ last_event: 'delivered' }), text: async () => '' }; }));
    const ok = await check();
    expect(ok.status).toBe(200);
    expect(calls.some(([u]) => u === 'https://api.resend.com/emails')).toBe(false);
    expect(blobs.get('last-check').ok).toBe(true);
  });
});
