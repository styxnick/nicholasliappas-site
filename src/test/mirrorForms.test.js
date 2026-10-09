import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';

// Netlify only stores fields it discovers in the hidden mirror forms at deploy
// time, so every form must declare the attribution fields netlifyForms sends.
const ATTRIBUTION = ['landing_page', 'source', 'medium', 'campaign', 'referrer'];
const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
const forms = [...new JSDOM(html).window.document.querySelectorAll('form[netlify]')];

describe('hidden Netlify mirror forms', () => {
  it('exist for every form the site submits', () => {
    expect(forms.map((f) => f.getAttribute('name')).sort()).toEqual(['contact', 'home-valuation']);
  });

  it.each(forms.map((f) => [f.getAttribute('name'), f]))('%s declares every attribution field', (_, form) => {
    const names = [...form.querySelectorAll('input')].map((i) => i.getAttribute('name'));
    for (const field of ATTRIBUTION) expect(names).toContain(field);
  });
});
