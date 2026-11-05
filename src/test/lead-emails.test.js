import { describe, it, expect } from 'vitest';
import { leadFromPayload, buildAlert, buildConfirmation, alertSubject, INTEREST_LABELS } from '../../netlify/lib/lead-emails.js';

const mk = (form, data, extra = {}) => leadFromPayload({
  form_name: form, created_at: '2026-11-05T15:21:00Z', name: data.name, email: data.email, data,
  ordered_human_fields: Object.entries(data).map(([name, value]) => ({ name, title: name, value })),
  ...extra,
});

describe('leadFromPayload', () => {
  it('normalises name, first name, email and phone', () => {
    const l = mk('contact', { name: 'JANE DOE', email: ' jane@example.com ', phone: '(516) 555-1212', interest: 'buying' });
    expect(l.name).toBe('Jane Doe');
    expect(l.firstName).toBe('Jane');
    expect(l.email).toBe('jane@example.com');
    expect(l.interestLabel).toBe('Buying a Home');
  });

  it('keeps mixed-case names as typed and falls back when missing', () => {
    expect(mk('contact', { name: 'Mary-Kate McDonald', email: 'x@y.z' }).name).toBe('Mary-Kate McDonald');
    expect(mk('contact', { email: 'x@y.z' }).name).toBe('there');
  });

  it('hides attribution and bot fields from the field list and labels interests', () => {
    const l = mk('contact', { name: 'A', email: 'a@b.c', interest: 'selling', 'bot-field': '', landing_page: '/', source: 'direct', medium: 'none', campaign: '', referrer_url: '' });
    const keys = l.fields.map(([k]) => k);
    expect(keys).toEqual(['Name', 'Email', 'Interest']);
    expect(l.fields.find(([k]) => k === 'Interest')[1]).toBe('Selling a Property');
  });
});

describe('buildConfirmation', () => {
  it('is addressed to the lead, from Nicholas, with replies going to his Compass inbox', () => {
    const c = buildConfirmation(mk('contact', { name: 'Jane Doe', email: 'jane@example.com', phone: '5165551212', interest: 'buying' }));
    expect(c.to).toEqual(['jane@example.com']);
    expect(c.from).toBe('Nicholas Liappas <nicholas@nicholasliappas.com>');
    expect(c.reply_to).toBe('nicholas.liappas@compass.com');
    expect(c.subject).toBe('Thank you, Jane — I’ll be in touch within one business day');
  });

  it.each(Object.keys(INTEREST_LABELS))('tailors the contact copy for interest "%s"', (interest) => {
    const c = buildConfirmation(mk('contact', { name: 'Jane Doe', email: 'jane@example.com', interest }));
    expect(c.html).toContain('Hi Jane,');
    expect(c.text).toContain('within one business day');
    expect(c.html).toContain('tel:+15162147761');
    expect(c.html).toContain('sms:+15162147761');
  });

  it('names the town when the lead came from a town page', () => {
    const c = buildConfirmation(mk('contact', { name: 'Jane Doe', email: 'jane@example.com', interest: 'buying', landing_page: '/port-washington' }));
    expect(c.text).toContain('buying a home in Port Washington');
    const h = buildConfirmation(mk('contact', { name: 'Jane Doe', email: 'jane@example.com', interest: 'buying', landing_page: '/' }));
    expect(h.text).toContain('buying a home in the North Shore');
  });

  it('echoes the address and the 24–48 hour promise for valuations', () => {
    const c = buildConfirmation(mk('home-valuation', { address: '14 Plandome Rd', zipCode: '11030', name: 'Priya N', email: 'p@example.com' }));
    expect(c.subject).toBe('Your home valuation request — 14 Plandome Rd');
    expect(c.html).toContain('<strong>14 Plandome Rd, 11030</strong>');
    expect(c.text).toContain('24 to 48 business hours');
    expect(c.text).toContain('Comparative Market Analysis');
  });

  it('echoes property type, location, timeline and role for commercial inquiries', () => {
    const c = buildConfirmation(mk('commercial', { name: 'Tom Russo', email: 't@example.com', role: 'Tenant looking for space', propertyType: 'Medical', location: 'Great Neck', timeline: '3–6 months' }));
    expect(c.subject).toBe('Your commercial inquiry — Medical in Great Neck');
    expect(c.text).toContain('medical property in Great Neck on a 3–6 months timeline');
    expect(c.text).toContain('space requirements, term, and build-out');
    const now = buildConfirmation(mk('commercial', { name: 'T', email: 't@example.com', propertyType: 'Other', timeline: 'Now' }));
    expect(now.subject).toBe('Your commercial property inquiry');
    expect(now.text).toContain('commercial property on a near-term timeline');
  });

  it('carries the signature, office, and brokerage disclosure in html and text', () => {
    const c = buildConfirmation(mk('contact', { name: 'Jane Doe', email: 'jane@example.com', interest: 'selling' }));
    for (const body of [c.html, c.text]) {
      expect(body).toContain('Licensed Associate Real Estate Broker');
      expect(body).toContain('1468 Northern Blvd, Manhasset, NY 11030');
      expect(body).toContain('Compass is a licensed real estate broker and abides by Equal Housing Opportunity laws.');
    }
    expect(c.html).toContain('https://nicholasliappas.com/email/nicholas-headshot-240.jpg');
  });

  it('escapes what the visitor typed', () => {
    const c = buildConfirmation(mk('home-valuation', { address: '1 <b>Main</b> & Co', zipCode: '11030', name: '<script>x</script>', email: 'x@example.com' }));
    expect(c.html).not.toContain('<b>Main</b>');
    expect(c.html).toContain('1 &lt;b&gt;Main&lt;/b&gt; &amp; Co');
    expect(c.html).not.toContain('<script>x');
  });

  it('is skipped when there is no usable email', () => {
    expect(buildConfirmation(mk('contact', { name: 'Jane Doe', email: '', interest: 'buying' }))).toBeNull();
    expect(buildConfirmation(mk('contact', { name: 'Jane Doe', email: 'not-an-email', interest: 'buying' }))).toBeNull();
  });
});

describe('buildAlert', () => {
  const lead = mk('contact', { name: 'jane doe', email: 'jane@example.com', phone: '516-555-1212', interest: 'buying', landing_page: '/manhasset', source: 'google', medium: 'organic', campaign: '', referrer_url: '' });

  it('puts who and what in the subject', () => {
    expect(alertSubject(lead)).toBe('New lead · Jane Doe · Buying a Home');
    expect(alertSubject(mk('home-valuation', { address: '14 Plandome Rd', name: 'Priya N', email: 'p@x.y' }))).toBe('New lead · Priya N · Valuation · 14 Plandome Rd');
    expect(alertSubject(mk('commercial', { name: 'Tom Russo', email: 't@x.y', propertyType: 'Medical', location: 'Great Neck' }))).toBe('New lead · Tom Russo · Medical in Great Neck');
  });

  it('offers one-tap call, text and email and replies to the lead', () => {
    const a = buildAlert(lead, ['nicholas.liappas@compass.com', 'second@example.com']);
    expect(a.to).toEqual(['nicholas.liappas@compass.com', 'second@example.com']);
    expect(a.reply_to).toBe('jane@example.com');
    expect(a.html).toContain('href="tel:+15165551212"');
    expect(a.html).toContain('href="sms:+15165551212"');
    expect(a.html).toContain('href="mailto:jane@example.com"');
    expect(a.text).toContain('Interest: Buying a Home');
    expect(a.text).toMatch(/Source: google \(organic\)/);
  });

  it('omits call and text when no phone was given', () => {
    const a = buildAlert(mk('home-valuation', { address: '1 Main St', zipCode: '11030', name: 'P', email: 'p@x.y', phone: '' }), ['a@b.c']);
    expect(a.html).not.toContain('tel:');
    expect(a.html).toContain('mailto:p@x.y');
  });
});

describe('buyers-guide emails', () => {
  const lead = mk('buyers-guide', { name: 'Jane Doe', email: 'jane@example.com', phone: '', town: 'Manhasset', guide: '/manhasset/buyers-guide' });

  it('confirms with a link to the guide and the usual signature', () => {
    const c = buildConfirmation(lead);
    expect(c.subject).toBe('Your Manhasset Buyer’s Guide');
    expect(c.html).toContain('href="https://nicholasliappas.com/manhasset/buyers-guide"');
    expect(c.html).toContain('>Read the guide<');
    expect(c.text).toContain('Read it here: https://nicholasliappas.com/manhasset/buyers-guide');
    expect(c.html).toContain('Licensed Associate Real Estate Broker');
  });

  it('labels the alert and the fields', () => {
    expect(alertSubject(lead)).toBe('New lead · Jane Doe · Manhasset Buyer’s Guide');
    expect(lead.fields.map(([k]) => k)).toEqual(['Name', 'Email', 'Phone', 'Town', 'Guide']);
  });
});
