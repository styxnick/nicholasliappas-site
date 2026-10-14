import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';
import { pageContext } from '../lib/analytics';
import { commercialListings } from '../data/commercialListings';
import { commercialTransactions } from '../data/commercialTransactions';
import { propertyTypes, faqs } from '../data/commercial';

describe('/commercial route context', () => {
  it('classifies /commercial as its own page type', () => {
    expect(pageContext('/commercial')).toEqual({ page_type: 'commercial', town: '' });
  });
});

describe('commercial mirror form', () => {
  const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
  const form = new JSDOM(html).window.document.querySelector('form[name="commercial"]');

  it('exists so Netlify stores submissions', () => {
    expect(form).not.toBeNull();
    expect(form.getAttribute('netlify-honeypot')).toBe('bot-field');
  });

  it('declares every field the commercial form sends', () => {
    const names = [...form.querySelectorAll('input, select, textarea')].map((e) => e.getAttribute('name'));
    for (const f of ['bot-field', 'name', 'email', 'phone', 'role', 'propertyType', 'location', 'size', 'timeline', 'message',
      'landing_page', 'source', 'medium', 'campaign', 'referrer_url']) {
      expect(names, `missing ${f}`).toContain(f);
    }
  });

  it('offers Commercial Property on the homepage contact form mirror', () => {
    const contact = new JSDOM(html).window.document.querySelector('form[name="contact"] select[name="interest"]');
    expect([...contact.options].map((o) => o.value)).toContain('commercial');
  });
});

describe('commercial data', () => {
  it('ships Available Now empty (section hidden until listings are added)', () => {
    expect(Array.isArray(commercialListings)).toBe(true);
    expect(commercialListings).toHaveLength(0);
  });

  it('transactions have the fields the cards render and no prices', () => {
    expect(Array.isArray(commercialTransactions)).toBe(true);
    for (const t of commercialTransactions) {
      expect(t.address, JSON.stringify(t)).toBeTruthy();
      expect(['Sale', 'Lease']).toContain(t.dealType);
      expect(Object.keys(t)).not.toContain('price');
    }
  });

  it('has eight property types, each mapped to an image slug', () => {
    expect(propertyTypes).toHaveLength(8);
    for (const p of propertyTypes) expect(typeof p.image).toBe('string');
  });

  it('has six FAQs with question and answer', () => {
    expect(faqs).toHaveLength(6);
    for (const f of faqs) { expect(f.q).toBeTruthy(); expect(f.a).toBeTruthy(); }
  });
});
