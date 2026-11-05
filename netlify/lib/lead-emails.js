// Email builders for netlify/functions/submission-created.js.
//
//   leadFromPayload(payload)      normalises a Netlify Forms payload
//   buildAlert(lead, recipients)  the "new lead" email to Nicholas
//   buildConfirmation(lead)       the confirmation the lead receives, or null
//
// Pure functions (no network, no env) so they are easy to test and preview.

export const SITE_URL = 'https://nicholasliappas.com';
export const NICHOLAS_EMAIL = 'nicholas.liappas@compass.com';
export const PHONE_DISPLAY = '516-214-7761';
export const PHONE_E164 = '+15162147761';
export const OFFICE = '1468 Northern Blvd, Manhasset, NY 11030';
export const ALERT_FROM = 'Nicholas Liappas Website <leads@nicholasliappas.com>';
export const CONFIRMATION_FROM = 'Nicholas Liappas <nicholas@nicholasliappas.com>';

// First-touch attribution stamped on every submission by src/lib/netlifyForms.jsx.
export const ATTRIBUTION_FIELDS = ['landing_page', 'source', 'medium', 'campaign', 'referrer_url'];
const HIDDEN_FIELDS = new Set(['ip', 'user_agent', 'bot-field', 'form-name', ...ATTRIBUTION_FIELDS]);

// Values of the contact form's "I'm interested in…" select (src/components/ContactForm.jsx).
export const INTEREST_LABELS = {
  buying: 'Buying a Home',
  selling: 'Selling a Property',
  both: 'Buying & Selling',
  valuation: 'Home Valuation',
  investing: 'Investment Properties',
  relocation: 'Relocation Services',
  commercial: 'Commercial Property',
};

const FIELD_TITLES = {
  name: 'Name', email: 'Email', phone: 'Phone', interest: 'Interest', address: 'Property address', zipCode: 'ZIP code',
  role: 'Role', propertyType: 'Property type', location: 'Location', size: 'Size', timeline: 'Timeline', message: 'Message',
};

export const escapeHtml = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const dash = (v) => (v && String(v).trim()) || '—';
const digits = (phone) => String(phone || '').replace(/\D/g, '');
const cleanName = (s) => String(s || '').trim().replace(/\s+/g, ' ').slice(0, 80);
// Title-case a name the visitor typed in all caps or all lower case; leave mixed case alone.
const niceName = (s) => (/^[^a-z]*$/.test(s) || /^[^A-Z]*$/.test(s)) ? s.toLowerCase().replace(/(^|[\s'-])(\p{L})/gu, (m, p, c) => p + c.toUpperCase()) : s;

export function leadFromPayload(payload = {}) {
  const data = payload.data || {};
  const formName = payload.form_name || 'unknown';
  const name = niceName(cleanName(payload.name || data.name || '')) || 'there';
  const firstName = name.split(' ')[0];
  const email = String(payload.email || data.email || '').trim();
  const phone = String(data.phone || '').trim();
  const fields = (payload.ordered_human_fields?.length
    ? payload.ordered_human_fields.filter((f) => !HIDDEN_FIELDS.has(f.name)).map((f) => [FIELD_TITLES[f.name] || f.title || f.name, f.value, f.name])
    : Object.entries(data).filter(([k]) => !HIDDEN_FIELDS.has(k)).map(([k, v]) => [FIELD_TITLES[k] || k, v, k]))
    .map(([title, value, key]) => [title, key === 'interest' ? (INTEREST_LABELS[value] || value) : value]);
  const when = new Date(payload.created_at || Date.now()).toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'medium', timeStyle: 'short' });
  return {
    formName, data, name, firstName, email, phone, fields, when,
    interest: data.interest || '',
    interestLabel: INTEREST_LABELS[data.interest] || '',
    dashboard: `https://app.netlify.com/projects/nicholaswebsite/forms/${payload.form_id || ''}`,
  };
}

// ---------------------------------------------------------------------------
// Shared HTML pieces. Email clients don't load web fonts, so the site's Inter /
// Cormorant pairing maps to Helvetica/Arial and Georgia.
const SANS = "-apple-system,'Segoe UI',Helvetica,Arial,sans-serif";
const SERIF = "Georgia,'Times New Roman',serif";
const INK = '#1a1a1a';
const MUTED = '#6b6b6b';
const RULE = '#e6e6e2';

const button = (href, label, solid) => `<a href="${escapeHtml(href)}" style="display:inline-block;white-space:nowrap;margin:0 10px 10px 0;padding:13px 24px;font-family:${SANS};font-size:12px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;border:1px solid ${INK};${solid ? `background:${INK};color:#ffffff;` : `background:#ffffff;color:${INK};`}">${escapeHtml(label)}</a>`;

const shell = ({ preheader, body }) => `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>Nicholas Liappas</title></head>
<body style="margin:0;padding:0;background:#f4f4f1;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f1;">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;">
      <tr><td style="padding:36px 40px 0;font-family:${SANS};font-size:10px;letter-spacing:3px;text-transform:uppercase;color:${MUTED};">The Liappas Team at Compass</td></tr>
      ${body}
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
      <tr><td style="padding:20px 40px 0;font-family:${SANS};font-size:11px;line-height:1.7;color:#8a8a8a;">
        Nicholas Liappas, Licensed Associate Real Estate Broker · The Liappas Team at Compass · ${escapeHtml(OFFICE)}<br>
        Compass is a licensed real estate broker and abides by Equal Housing Opportunity laws.
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

const signature = () => `
      <tr><td style="padding:8px 40px 36px;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="border-top:1px solid ${RULE};width:100%;">
          <tr>
            <td style="padding:24px 18px 0 0;width:72px;vertical-align:top;">
              <img src="${SITE_URL}/email/nicholas-headshot-240.jpg" width="72" height="72" alt="Nicholas Liappas" style="display:block;width:72px;height:72px;border-radius:36px;">
            </td>
            <td style="padding:24px 0 0;vertical-align:top;font-family:${SANS};font-size:13px;line-height:1.7;color:${INK};">
              <span style="font-family:${SERIF};font-size:18px;letter-spacing:0.5px;">Nicholas Liappas</span><br>
              <span style="color:${MUTED};">Licensed Associate Real Estate Broker</span><br>
              <span style="color:${MUTED};">The Liappas Team at Compass</span><br>
              <a href="tel:${PHONE_E164}" style="color:${INK};text-decoration:none;">${PHONE_DISPLAY}</a>
              <span style="color:#c4c4c0;">&nbsp;·&nbsp;</span>
              <a href="mailto:${NICHOLAS_EMAIL}" style="color:${INK};text-decoration:none;">${NICHOLAS_EMAIL}</a><br>
              <a href="${SITE_URL}" style="color:${INK};text-decoration:none;">nicholasliappas.com</a>
            </td>
          </tr>
        </table>
      </td></tr>`;

const para = (html) => `<p style="margin:0 0 18px;font-family:${SANS};font-size:15px;line-height:1.75;color:${INK};">${html}</p>`;

// ---------------------------------------------------------------------------
// Confirmation to the lead: what they asked for, what happens next, how to
// reach Nicholas directly. Copy is specific to the form and, for the contact
// form, to the interest they picked.

function confirmationCopy(lead) {
  const { formName, data, interest } = lead;
  const e = escapeHtml;
  if (formName === 'home-valuation') {
    const where = [data.address, data.zipCode].filter(Boolean).join(', ');
    return {
      subject: where ? `Your home valuation request — ${data.address}` : 'Your home valuation request',
      preheader: 'I will review recent comparable sales and send you a Comparative Market Analysis within 24 to 48 business hours.',
      heading: 'Your valuation is underway.',
      paragraphs: [
        `Thank you for requesting a valuation${where ? ` for <strong>${e(where)}</strong>` : ''}. Here is what happens next: I will review recent comparable sales and current inventory around the property and prepare a Comparative Market Analysis. You will hear from me within 24 to 48 business hours with the numbers and the reasoning behind them.`,
        'If anything about the home is not visible from the outside, such as a renovation, an addition, or a finished basement, reply to this email and let me know. It changes which sales I compare it to.',
      ],
      text: [
        `Thank you for requesting a valuation${where ? ` for ${where}` : ''}. I will review recent comparable sales and current inventory around the property and prepare a Comparative Market Analysis. You will hear from me within 24 to 48 business hours with the numbers and the reasoning behind them.`,
        'If anything about the home is not visible from the outside (a renovation, an addition, a finished basement), reply to this email and let me know. It changes which sales I compare it to.',
      ],
    };
  }
  if (formName === 'commercial') {
    const type = data.propertyType && data.propertyType !== 'Other' ? data.propertyType.toLowerCase() : '';
    const what = type ? `${type} property` : 'commercial property';
    const where = data.location ? ` in ${data.location}` : '';
    const role = String(data.role || '');
    const roleLine =
      /owner|seller/i.test(role) ? 'what you want out of a sale or lease and how the building is currently performing' :
      /landlord/i.test(role) ? 'the space, the lease terms you have in mind, and the tenant profile that fits' :
      /tenant/i.test(role) ? 'your space requirements, term, and build-out needs' :
      /developer/i.test(role) ? 'the site, zoning, and what you are looking to build' :
      /business owner/i.test(role) ? 'what your business needs from a building and how an owner-user purchase would pencil' :
      /buyer|investor/i.test(role) ? 'your criteria, target returns, and timing' :
      'what you are looking to do';
    return {
      subject: type ? `Your commercial inquiry — ${data.propertyType}${data.location ? ` in ${data.location}` : ''}` : 'Your commercial property inquiry',
      preheader: 'I will call you within one business day and come with real numbers for that market.',
      heading: 'Thank you for your inquiry.',
      paragraphs: [
        `Thank you for reaching out about <strong>${e(what)}${e(where)}</strong>${data.timeline ? ` on a <strong>${e(data.timeline.toLowerCase() === 'now' ? 'near-term' : data.timeline)}</strong> timeline` : ''}. I will call you within one business day to understand ${roleLine}.`,
        `Before we speak, I will pull what has traded and what is currently available in that market, so we start with real numbers rather than a guess. Since I have built and renovated buildings myself, I will also tell you what I see when I walk a property, not just what the listing says.`,
      ],
      text: [
        `Thank you for reaching out about ${what}${where}${data.timeline ? ` on a ${data.timeline.toLowerCase() === 'now' ? 'near-term' : data.timeline} timeline` : ''}. I will call you within one business day to understand ${roleLine}.`,
        'Before we speak, I will pull what has traded and what is currently available in that market, so we start with real numbers rather than a guess. Since I have built and renovated buildings myself, I will also tell you what I see when I walk a property, not just what the listing says.',
      ],
    };
  }
  // Contact form (home page and town pages)
  const town = String(data.landing_page || '').replace(/^\//, '').replace(/[#?].*$/, '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const area = /^(Manhasset|Port Washington|Roslyn|East Hills|Glen Head|Glenwood Landing)$/.test(town) ? town : 'the North Shore';
  const byInterest = {
    buying: {
      heading: 'Let’s find your next home.',
      p: [`Thank you for reaching out about buying a home in ${area}. I will call you within one business day to hear what you are looking for, including neighborhoods, timing, and budget, and to talk through how the market is moving right now.`,
          'If you already have a few towns or listings in mind, reply with them and I will come to the call prepared.'],
    },
    selling: {
      heading: 'Let’s talk about your sale.',
      p: ['Thank you for reaching out about selling your property. I will call you within one business day. Before we speak, I will start pulling recent comparable sales so we can have a real pricing conversation from the first call.',
          'If you reply with the property address, I will have numbers ready when we talk.'],
    },
    both: {
      heading: 'Buying and selling, in the right order.',
      p: ['Thank you for reaching out. Buying and selling at the same time comes down to sequencing, and that is where I can help most. I will call you within one business day to map out timing, pricing for your current home, and what you are looking for next.',
          'If you reply with your current address, I will start on the comparable sales before we speak.'],
    },
    valuation: {
      heading: 'Your valuation is underway.',
      p: ['Thank you for requesting a home valuation. I will call you within one business day and prepare a Comparative Market Analysis based on recent sales near you.',
          'If you reply with the property address, I will get started today.'],
    },
    investing: {
      heading: 'Let’s talk about the numbers.',
      p: ['Thank you for reaching out about investment property. I will call you within one business day to understand your criteria, including asset type, target returns, and how hands-on you want to be, and I will share what is actually trading right now on the North Shore and in Queens.',
          'If there is a specific property or deal type on your mind, reply with it and I will look before we speak.'],
    },
    relocation: {
      heading: 'Welcome to the North Shore.',
      p: ['Thank you for reaching out about relocating to the area. I will call you within one business day. I grew up on the North Shore, so beyond listings I can walk you through the towns, schools, commutes, and how each community lives day to day.',
          'If you know your target move date or the areas you are considering, reply with them and I will tailor the call.'],
    },
    commercial: {
      heading: 'Thank you for your inquiry.',
      p: ['Thank you for reaching out about commercial property. I will call you within one business day to understand what you are looking to do, whether that is buying, selling, leasing, or developing, and I will come with a view of what is trading in that market.',
          'If there is a specific property or location, reply with it and I will look before we speak.'],
    },
  };
  const c = byInterest[interest] || {
    heading: 'Thank you for reaching out.',
    p: ['Thank you for getting in touch. I will call you within one business day to hear what you are looking for and how I can help.',
        'If there is anything specific you would like me to look into first, reply to this email and I will come prepared.'],
  };
  return {
    subject: `Thank you, ${lead.firstName} — I’ll be in touch within one business day`,
    preheader: c.p[0].slice(0, 120),
    heading: c.heading,
    paragraphs: c.p.map(e),
    text: c.p,
  };
}

export function buildConfirmation(lead) {
  if (!lead.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return null;
  const copy = confirmationCopy(lead);
  const greeting = lead.firstName && lead.firstName !== 'there' ? `Hi ${lead.firstName},` : 'Hello,';

  const html = shell({
    preheader: copy.preheader,
    body: `
      <tr><td style="padding:26px 40px 10px;font-family:${SERIF};font-size:30px;line-height:1.2;font-weight:normal;letter-spacing:0.5px;color:${INK};">${escapeHtml(copy.heading)}</td></tr>
      <tr><td style="padding:8px 40px 0;">
        ${para(escapeHtml(greeting))}
        ${copy.paragraphs.map(para).join('')}
        ${para(`In the meantime, the fastest way to reach me is my cell. Call or text <a href="tel:${PHONE_E164}" style="color:${INK};">${PHONE_DISPLAY}</a> any time.`)}
      </td></tr>
      <tr><td style="padding:6px 40px 20px;">
        ${button(`tel:${PHONE_E164}`, `Call ${PHONE_DISPLAY}`, true)}${button(`sms:${PHONE_E164}`, 'Text Nicholas', false)}
      </td></tr>
      ${signature()}`,
  });

  const text = [
    greeting,
    '',
    ...copy.text.flatMap((p) => [p, '']),
    `In the meantime, the fastest way to reach me is my cell: call or text ${PHONE_DISPLAY} any time.`,
    '',
    'Nicholas Liappas',
    'Licensed Associate Real Estate Broker',
    'The Liappas Team at Compass',
    `${PHONE_DISPLAY} · ${NICHOLAS_EMAIL}`,
    OFFICE,
    SITE_URL,
    '',
    'Compass is a licensed real estate broker and abides by Equal Housing Opportunity laws.',
  ].join('\n');

  return {
    from: CONFIRMATION_FROM,
    to: [lead.email],
    reply_to: NICHOLAS_EMAIL,
    subject: copy.subject,
    text,
    html,
    tags: [{ name: 'kind', value: 'confirmation' }, { name: 'form', value: lead.formName.replace(/[^a-z0-9_-]/gi, '_') }],
  };
}

// ---------------------------------------------------------------------------
// Alert to Nicholas: who, what, one-tap call / text / email, then every field
// and the first-touch attribution.

export function alertSubject(lead) {
  const { formName, data } = lead;
  const what =
    formName === 'home-valuation' ? `Valuation · ${dash(data.address)}` :
    formName === 'commercial' ? [data.propertyType, data.location].filter(Boolean).join(' in ') || 'Commercial' :
    lead.interestLabel || 'Contact';
  return `New lead · ${lead.name} · ${what}`;
}

export function buildAlert(lead, recipients) {
  const { fields, when, dashboard } = lead;
  const attribution = [
    ['Landing page', dash(lead.data.landing_page)],
    ['Source', lead.data.source ? `${lead.data.source} (${lead.data.medium || 'none'})` : '—'],
    ['Campaign', dash(lead.data.campaign)],
    ['Referrer', dash(lead.data.referrer_url)],
  ];
  const tel = digits(lead.phone);
  const actions = [
    tel ? [`tel:+1${tel.replace(/^1/, '')}`, 'Call', true] : null,
    tel ? [`sms:+1${tel.replace(/^1/, '')}`, 'Text', false] : null,
    lead.email ? [`mailto:${lead.email}`, 'Email', false] : null,
  ].filter(Boolean);

  const text = [
    `New website lead — ${lead.formName}`,
    `Received ${when} ET`,
    '',
    ...fields.map(([k, v]) => `${k}: ${dash(v)}`),
    '',
    tel ? `Call/text: ${lead.phone}` : '',
    '',
    'Attribution',
    ...attribution.map(([k, v]) => `${k}: ${v}`),
    '',
    `All submissions: ${dashboard}`,
  ].join('\n');

  const html = shell({
    preheader: `${lead.name} · ${fields.map(([, v]) => v).filter(Boolean).slice(1, 4).join(' · ')}`,
    body: `
      <tr><td style="padding:22px 40px 0;font-family:${SANS};font-size:12px;color:${MUTED};">New website lead · ${escapeHtml(lead.formName)} · ${escapeHtml(when)} ET</td></tr>
      <tr><td style="padding:8px 40px 18px;font-family:${SERIF};font-size:30px;line-height:1.2;color:${INK};">${escapeHtml(lead.name)}</td></tr>
      ${actions.length ? `<tr><td style="padding:0 40px 16px;">${actions.map(([href, label, solid]) => button(href, label, solid)).join('')}</td></tr>` : ''}
      <tr><td style="padding:0 40px;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;border-top:1px solid ${RULE};">
          ${fields.map(([k, v]) => `<tr><td style="padding:10px 16px 10px 0;font-family:${SANS};font-size:13px;color:${MUTED};vertical-align:top;white-space:nowrap;border-bottom:1px solid ${RULE};">${escapeHtml(k)}</td><td style="padding:10px 0;font-family:${SANS};font-size:15px;color:${INK};border-bottom:1px solid ${RULE};">${escapeHtml(dash(v))}</td></tr>`).join('')}
        </table>
      </td></tr>
      <tr><td style="padding:26px 40px 4px;font-family:${SANS};font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${MUTED};">Attribution</td></tr>
      <tr><td style="padding:0 40px 28px;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          ${attribution.map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;font-family:${SANS};font-size:13px;color:${MUTED};vertical-align:top;">${escapeHtml(k)}</td><td style="padding:4px 0;font-family:${SANS};font-size:13px;color:${INK};">${escapeHtml(v)}</td></tr>`).join('')}
        </table>
      </td></tr>
      <tr><td style="padding:0 40px 36px;font-family:${SANS};font-size:13px;line-height:1.7;color:${MUTED};">Reply to this email to answer ${escapeHtml(lead.name)} directly${lead.email ? '' : ' (no email was provided)'}.<br><a href="${dashboard}" style="color:${INK};">All submissions in Netlify</a></td></tr>`,
  });

  return {
    from: ALERT_FROM,
    to: recipients,
    reply_to: lead.email || undefined,
    subject: alertSubject(lead),
    text,
    html,
    tags: [{ name: 'kind', value: 'alert' }, { name: 'form', value: lead.formName.replace(/[^a-z0-9_-]/gi, '_') }],
  };
}
