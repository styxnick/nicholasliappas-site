// Shapes one Netlify Forms submission into a flat CSV row (used by export-leads.mjs).
export const HEADERS = [
  'form', 'submitted_at', 'name', 'email', 'phone', 'interest', 'address', 'zip',
  'landing_page', 'source', 'medium', 'campaign', 'referrer_url', 'netlify_id'
];

export function toRow(form, s) {
  const f = Object.fromEntries((s.ordered_human_fields || []).map((x) => [x.name, x.value]));
  const d = s.data || {};
  return {
    form: form.name,
    submitted_at: new Date(s.created_at).toLocaleString('en-US', { timeZone: 'America/New_York' }),
    name: f.name ?? s.name ?? '',
    email: f.email ?? s.email ?? '',
    phone: f.phone ?? '',
    interest: f.interest ?? '',
    address: f.address ?? '',
    zip: f.zipCode ?? '',
    landing_page: d.landing_page ?? '',
    source: d.source ?? '',
    medium: d.medium ?? '',
    campaign: d.campaign ?? '',
    referrer_url: d.referrer_url ?? '',
    netlify_id: s.id
  };
}
