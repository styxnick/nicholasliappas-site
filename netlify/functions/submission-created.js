// Netlify event function: runs on every verified Netlify Forms submission
// (the file name "submission-created" is what wires it up). Sends the lead to
// Nicholas via Resend from leads@nicholasliappas.com. Netlify Forms keeps
// every submission as the backup log regardless of what happens here.
//
// Env: RESEND_API_KEY (required), LEAD_TO (optional override of recipient).

const FROM = 'Nicholas Liappas Website <leads@nicholasliappas.com>';
const DEFAULT_TO = 'nicholas.liappas@compass.com';
const SITE_ID = '1bb10d34-4eb0-41e0-bd36-4a6cd3fde292';

const escapeHtml = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export default async (request) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('submission-created: RESEND_API_KEY is not set; lead kept in Netlify Forms only');
    return new Response('missing RESEND_API_KEY', { status: 500 });
  }

  const { payload } = await request.json();
  const formName = payload.form_name || 'unknown';
  const fields = payload.ordered_human_fields?.length
    ? payload.ordered_human_fields.map((f) => [f.title, f.value])
    : Object.entries(payload.data || {}).filter(([k]) => !['ip', 'user_agent', 'referrer', 'bot-field'].includes(k));
  const leadName = payload.name || payload.data?.name || 'Unknown';
  const leadEmail = payload.email || payload.data?.email || '';
  const when = new Date(payload.created_at || Date.now()).toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'medium', timeStyle: 'short' });
  const dashboard = `https://app.netlify.com/projects/nicholaswebsite/forms/${payload.form_id || ''}`;

  const text = [
    `New website lead — ${formName}`,
    `Received ${when} ET`,
    '',
    ...fields.map(([k, v]) => `${k}: ${v || '—'}`),
    '',
    `Referrer: ${payload.data?.referrer || '—'}`,
    `All submissions: ${dashboard}`
  ].join('\n');

  const html = `
    <div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1a1a1a">
      <p style="margin:0 0 4px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#707070">New website lead · ${escapeHtml(formName)}</p>
      <p style="margin:0 0 20px;color:#707070">Received ${escapeHtml(when)} ET</p>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse">
        ${fields.map(([k, v]) => `<tr><td style="padding:6px 16px 6px 0;color:#707070;vertical-align:top">${escapeHtml(k)}</td><td style="padding:6px 0;font-weight:600">${escapeHtml(v || '—')}</td></tr>`).join('')}
      </table>
      <p style="margin:24px 0 0;font-size:13px;color:#707070">Reply to this email to answer ${escapeHtml(leadName)} directly.<br><a href="${dashboard}" style="color:#1a1a1a">All submissions in Netlify</a></p>
    </div>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM,
      to: [process.env.LEAD_TO || DEFAULT_TO],
      reply_to: leadEmail || undefined,
      subject: `New website lead: ${formName} — ${leadName}`,
      text,
      html,
      tags: [{ name: 'form', value: formName.replace(/[^a-z0-9_-]/gi, '_') }]
    })
  });

  const body = await res.text();
  if (!res.ok) {
    console.error(`submission-created: Resend ${res.status}: ${body}`);
    return new Response(body, { status: 502 });
  }
  console.log(`submission-created: sent lead "${leadName}" (${formName}) via Resend: ${body}`);
  return new Response(body, { status: 200 });
};
