// Weekly end-to-end check of the lead pipeline. Three parts:
//
//   canary-submit (scheduled)   POSTs a labelled lead through the real
//                               Netlify Forms endpoint and records "pending".
//   submission-created          recognises the canary by its email address,
//                               routes both emails to the canary inbox instead
//                               of Nicholas, and records the Resend ids.
//   canary-check (scheduled)    30 min later: did the submission reach the
//                               function, and does Resend say both emails were
//                               delivered? Emails Nicholas ONLY on failure.
//
// Pure helpers here; the functions do the I/O.

export const CANARY_EMAIL = 'nliappas+canary@gmail.com';
export const CANARY_NAME = 'Canary Check';
export const STORE_NAME = 'canary';
export const SITE_URL = 'https://nicholasliappas.com';
// How long after canary-submit the check waits before calling a missing record a failure.
export const MAX_AGE_MS = 6 * 60 * 60 * 1000;
export const DELIVERED = new Set(['delivered']);
export const IN_FLIGHT = new Set(['queued', 'sent', 'delivery_delayed', 'scheduled']);

export const isCanary = (lead) => String(lead?.email || '').toLowerCase() === CANARY_EMAIL;

// Body of the form POST canary-submit sends. Mirrors what src/lib/netlifyForms.jsx
// sends for the contact form, with attribution that makes the record obvious.
export function canaryFormBody(now = new Date()) {
  return new URLSearchParams({
    'form-name': 'contact',
    name: `${CANARY_NAME} ${now.toISOString().slice(0, 16)}Z`,
    email: CANARY_EMAIL,
    phone: '5162147761',
    interest: 'buying',
    'bot-field': '',
    landing_page: '/canary',
    source: 'canary',
    medium: 'monitor',
    campaign: 'weekly-check',
    referrer_url: '',
  }).toString();
}

// Decide pass/fail from the two blob records and the Resend lookups.
//   pending:  { submittedAt }                    written by canary-submit
//   latest:   { submittedAt, processedAt, alertId, confirmationId } written by submission-created
//   statuses: { [id]: last_event | 'lookup-failed' }
export function evaluateCanary({ pending, latest, statuses = {}, now = new Date() }) {
  const reasons = [];
  if (!pending?.submittedAt) {
    reasons.push('No pending record: canary-submit did not run or could not write to the store.');
    return { ok: false, reasons };
  }
  const submitted = new Date(pending.submittedAt);
  if (now - submitted > MAX_AGE_MS) {
    reasons.push(`Pending record is stale (submitted ${pending.submittedAt}); canary-submit has not run recently.`);
  }
  if (pending.submitStatus && pending.submitStatus !== 200) {
    reasons.push(`Form POST returned HTTP ${pending.submitStatus}.`);
  }
  const processed = latest?.processedAt ? new Date(latest.processedAt) : null;
  if (!processed || processed < submitted) {
    reasons.push('The canary submission never reached submission-created (Netlify Forms ingestion, spam filtering, or the function itself).');
    return { ok: false, reasons };
  }
  for (const [label, id] of [['Alert to Nicholas', latest.alertId], ['Confirmation to the lead', latest.confirmationId]]) {
    if (!id) { reasons.push(`${label}: no Resend id was recorded (send failed).`); continue; }
    const ev = statuses[id];
    if (DELIVERED.has(ev)) continue;
    if (IN_FLIGHT.has(ev)) reasons.push(`${label}: Resend reports "${ev}" 30 minutes after sending (not yet delivered).`);
    else reasons.push(`${label}: Resend reports "${ev || 'unknown'}".`);
  }
  return { ok: reasons.length === 0, reasons };
}

export function failureEmail({ reasons, pending, latest, statuses }, { from, to }) {
  const when = new Date().toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'medium', timeStyle: 'short' });
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const details = [
    ['Canary submitted', pending?.submittedAt || '—'],
    ['Reached function', latest?.processedAt || '—'],
    ['Alert email', latest?.alertId ? `${latest.alertId} → ${statuses?.[latest.alertId] || '?'}` : '—'],
    ['Confirmation email', latest?.confirmationId ? `${latest.confirmationId} → ${statuses?.[latest.confirmationId] || '?'}` : '—'],
  ];
  const text = [
    `The weekly lead-pipeline check FAILED (${when} ET).`,
    '',
    ...reasons.map((r) => `• ${r}`),
    '',
    ...details.map(([k, v]) => `${k}: ${v}`),
    '',
    'What to check: Netlify Forms (is the contact form still detected?), the submission-created function log, Resend domain status, and the RESEND_API_KEY secret.',
    'Forms: https://app.netlify.com/projects/nicholaswebsite/forms',
    'Functions: https://app.netlify.com/projects/nicholaswebsite/logs/functions',
  ].join('\n');
  const html = `<div style="font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#1a1a1a">
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#b00020">Lead pipeline check failed</p>
    <p style="margin:0 0 20px;color:#6b6b6b">${esc(when)} ET</p>
    <ul style="margin:0 0 20px;padding-left:20px">${reasons.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:13px">${details.map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#6b6b6b">${esc(k)}</td><td style="padding:4px 0">${esc(v)}</td></tr>`).join('')}</table>
    <p style="margin:20px 0 0;font-size:13px;color:#6b6b6b">What to check: <a href="https://app.netlify.com/projects/nicholaswebsite/forms" style="color:#1a1a1a">Netlify Forms</a> (is the contact form still detected?), the <a href="https://app.netlify.com/projects/nicholaswebsite/logs/functions" style="color:#1a1a1a">submission-created function log</a>, Resend domain status, and the RESEND_API_KEY secret. Until this is fixed, real leads may be arriving in Netlify Forms without an email.</p>
  </div>`;
  return { from, to, subject: `⚠️ Website lead pipeline check FAILED — ${reasons.length} problem${reasons.length === 1 ? '' : 's'}`, text, html, tags: [{ name: 'kind', value: 'canary' }] };
}
