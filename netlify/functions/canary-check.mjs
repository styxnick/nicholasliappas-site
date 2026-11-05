// Scheduled: verify last canary-submit made it through Netlify Forms, the
// submission-created function, and Resend delivery. Emails Nicholas only on
// failure (plus an ntfy push when NTFY_TOPIC is set). See netlify/lib/canary.js.
import { getStore } from '@netlify/blobs';
import { evaluateCanary, failureEmail, STORE_NAME } from '../lib/canary.js';

const DEFAULT_TO = 'nicholas.liappas@compass.com';
const FROM = 'Nicholas Liappas Website <leads@nicholasliappas.com>';

async function resendStatus(apiKey, id) {
  try {
    const r = await fetch(`https://api.resend.com/emails/${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${apiKey}` } });
    if (!r.ok) return `lookup-failed (${r.status})`;
    const j = await r.json();
    return j.last_event || 'unknown';
  } catch (err) {
    return `lookup-failed (${err})`;
  }
}

export default async () => {
  const apiKey = process.env.RESEND_API_KEY;
  const store = getStore(STORE_NAME);
  const pending = await store.get('pending', { type: 'json' });
  const latest = await store.get('latest', { type: 'json' });

  const statuses = {};
  if (apiKey && latest) {
    for (const id of [latest.alertId, latest.confirmationId].filter(Boolean)) statuses[id] = await resendStatus(apiKey, id);
  }
  const result = evaluateCanary({ pending, latest, statuses });
  if (!apiKey) result.reasons.push('RESEND_API_KEY is not set in the function environment.'), (result.ok = false);

  await store.setJSON('last-check', { checkedAt: new Date().toISOString(), ok: result.ok, reasons: result.reasons, statuses });

  if (result.ok) {
    console.log(`canary-check: OK (alert ${statuses[latest.alertId]}, confirmation ${statuses[latest.confirmationId]})`);
    return new Response('ok');
  }

  console.error(`canary-check: FAILED\n - ${result.reasons.join('\n - ')}`);
  if (apiKey) {
    const to = [process.env.LEAD_TO || DEFAULT_TO, ...(process.env.LEAD_ALERT_TO || '').split(',').map((s) => s.trim()).filter(Boolean)];
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(failureEmail({ ...result, pending, latest, statuses }, { from: FROM, to })),
    });
    if (!r.ok) console.error(`canary-check: failure email could not be sent: ${r.status} ${await r.text()}`);
  }
  if (process.env.NTFY_TOPIC) {
    await fetch(`https://ntfy.sh/${encodeURIComponent(process.env.NTFY_TOPIC)}`, {
      method: 'POST',
      headers: { Title: 'Website lead pipeline check FAILED', Priority: 'urgent', Tags: 'rotating_light' },
      body: result.reasons[0],
    }).catch((err) => console.error(`canary-check: ntfy push threw: ${err}`));
  }
  return new Response('failed', { status: 500 });
};

export const config = { schedule: '40 19 * * *' }; // TEMPORARY first-run schedule; weekly schedule follows in the next commit
