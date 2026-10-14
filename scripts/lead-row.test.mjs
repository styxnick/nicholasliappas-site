import { describe, it, expect } from 'vitest';
import { HEADERS, toRow } from './lead-row.mjs';

const submission = (fields, extra = {}) => ({
  id: 'sub_1',
  created_at: '2026-10-09T16:00:00Z',
  ordered_human_fields: Object.entries(fields).map(([name, value]) => ({ name, value })),
  data: fields,
  ...extra,
});

describe('lead-row', () => {
  it('appends the five attribution columns last, in a fixed order', () => {
    expect(HEADERS.slice(-6)).toEqual(['landing_page', 'source', 'medium', 'campaign', 'referrer_url', 'netlify_id']);
  });

  it('maps attribution fields from the submission', () => {
    const row = toRow({ name: 'contact' }, submission({
      name: 'Jane', email: 'j@x.com', landing_page: '/manhasset', source: 'instagram', medium: 'social', campaign: 'spring', referrer_url: 'https://www.instagram.com/',
    }));
    expect(row).toMatchObject({ form: 'contact', name: 'Jane', landing_page: '/manhasset', source: 'instagram', medium: 'social', campaign: 'spring', referrer_url: 'https://www.instagram.com/', netlify_id: 'sub_1' });
  });

  it('leaves attribution empty for legacy submissions', () => {
    const row = toRow({ name: 'contact' }, submission({ name: 'Jane' }));
    expect(row).toMatchObject({ landing_page: '', source: '', medium: '', campaign: '', referrer_url: '' });
  });

  it('every header has a value in the row', () => {
    const row = toRow({ name: 'contact' }, submission({ name: 'Jane' }));
    for (const h of HEADERS) expect(row).toHaveProperty(h);
  });
});
