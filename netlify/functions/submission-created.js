// Netlify event function: runs on every verified Netlify Forms submission
// (the file name "submission-created" is what wires it up). Netlify Forms
// keeps every submission as the backup log regardless of what happens here.
//
// 1. Alerts Nicholas by email (Resend, from leads@nicholasliappas.com).
// 2. Sends the lead a personalised confirmation (from nicholas@nicholasliappas.com,
//    replies go to Nicholas's Compass inbox).
// 3. Optionally pushes a short notification to a phone via ntfy.sh.
//
// Env: RESEND_API_KEY (required)
//      LEAD_TO        optional override of the alert recipient
//      LEAD_ALERT_TO  optional extra alert recipients, comma-separated
//                     (a second inbox, or a carrier email-to-SMS address)
//      NTFY_TOPIC     optional ntfy.sh topic for instant phone push (first name + form only)
import { leadFromPayload, buildAlert, buildConfirmation, alertSubject } from '../lib/lead-emails.js';

const DEFAULT_TO = 'nicholas.liappas@compass.com';

const sendEmail = (apiKey, message) => fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
  body: JSON.stringify(message),
});

export default async (request) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('submission-created: RESEND_API_KEY is not set; lead kept in Netlify Forms only');
    return new Response('missing RESEND_API_KEY', { status: 500 });
  }

  const { payload } = await request.json();
  const lead = leadFromPayload(payload);
  const recipients = [process.env.LEAD_TO || DEFAULT_TO, ...(process.env.LEAD_ALERT_TO || '').split(',').map((s) => s.trim()).filter(Boolean)];

  // 1. Alert Nicholas. This is the one that must succeed.
  const alert = buildAlert(lead, recipients);
  const res = await sendEmail(apiKey, alert);
  const body = await res.text();
  if (!res.ok) {
    console.error(`submission-created: Resend ${res.status}: ${body}`);
    return new Response(body, { status: 502 });
  }
  console.log(`submission-created: sent lead "${lead.name}" (${lead.formName}) via Resend: ${body}`);

  // 2. Confirmation to the lead. Failure here must not fail the alert.
  const confirmation = buildConfirmation(lead);
  if (confirmation) {
    try {
      const r = await sendEmail(apiKey, confirmation);
      const b = await r.text();
      if (!r.ok) console.error(`submission-created: confirmation to ${lead.email} failed ${r.status}: ${b}`);
      else console.log(`submission-created: confirmation sent to ${lead.email}: ${b}`);
    } catch (err) {
      console.error(`submission-created: confirmation to ${lead.email} threw: ${err}`);
    }
  } else {
    console.log('submission-created: no usable email on the lead; confirmation skipped');
  }

  // 3. Optional phone push. Keeps PII to a first name.
  const topic = process.env.NTFY_TOPIC;
  if (topic) {
    try {
      const r = await fetch(`https://ntfy.sh/${encodeURIComponent(topic)}`, {
        method: 'POST',
        headers: { Title: 'New website lead', Priority: 'high', Tags: 'house', Click: lead.dashboard },
        body: alertSubject({ ...lead, name: lead.firstName }),
      });
      if (!r.ok) console.error(`submission-created: ntfy push failed ${r.status}`);
    } catch (err) {
      console.error(`submission-created: ntfy push threw: ${err}`);
    }
  }

  return new Response(body, { status: 200 });
};
