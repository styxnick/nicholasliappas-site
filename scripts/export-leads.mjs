// Export every Netlify Forms submission (all forms) to one CSV for CRM import.
//   node scripts/export-leads.mjs                 -> ~/Desktop/leads-YYYY-MM-DD.csv
//   node scripts/export-leads.mjs path/to/out.csv
//   node scripts/export-leads.mjs --since 2026-09-01
// Uses the Netlify CLI's stored login (run `netlify login` once if needed).
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const SITE_ID = '1bb10d34-4eb0-41e0-bd36-4a6cd3fde292';
const args = process.argv.slice(2);
const sinceIdx = args.indexOf('--since');
const since = sinceIdx >= 0 ? new Date(args[sinceIdx + 1]) : null;
const outArg = args.find((a, i) => !a.startsWith('--') && (sinceIdx < 0 || i !== sinceIdx + 1));
const out = outArg || join(homedir(), 'Desktop', `leads-${new Date().toISOString().slice(0, 10)}.csv`);

const api = (method, data) => JSON.parse(execFileSync('netlify', ['api', method, '--data', JSON.stringify(data)], { encoding: 'utf8' }));

const forms = api('listSiteForms', { site_id: SITE_ID });
const rows = [];
for (const form of forms) {
  let page = 1;
  for (;;) {
    const batch = api('listFormSubmissions', { form_id: form.id, per_page: 100, page });
    for (const s of batch) {
      const created = new Date(s.created_at);
      if (since && created < since) continue;
      const f = Object.fromEntries((s.ordered_human_fields || []).map((x) => [x.name, x.value]));
      rows.push({
        form: form.name,
        submitted_at: created.toLocaleString('en-US', { timeZone: 'America/New_York' }),
        name: f.name ?? s.name ?? '',
        email: f.email ?? s.email ?? '',
        phone: f.phone ?? '',
        interest: f.interest ?? '',
        address: f.address ?? '',
        zip: f.zipCode ?? '',
        referrer: s.data?.referrer ?? '',
        netlify_id: s.id
      });
    }
    if (batch.length < 100) break;
    page += 1;
  }
}
rows.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));

const headers = ['form', 'submitted_at', 'name', 'email', 'phone', 'interest', 'address', 'zip', 'referrer', 'netlify_id'];
const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => q(r[h])).join(','))].join('\n') + '\n';
writeFileSync(out, csv);
console.log(`wrote ${rows.length} lead(s) from ${forms.length} form(s) to ${out}`);
