# Analytics design — nicholasliappas.com

Date: 2026-10-09
Status: approved in conversation, pending written review

## Problem

GA4 (property `G-1FTQ8KS469`) is live and receiving data, but the reports
cannot answer the four questions that matter to a one-person brokerage site:

1. Where do form leads come from (page, town, source, campaign)?
2. Which town pages and buyers guides perform?
3. Is marketing working month to month?
4. How often do visitors tap phone or email, and from where?

Causes: events are free-text (`click` / `form_submit` with a label string),
no parameters are registered as GA4 dimensions, phone/email taps are
indistinguishable from navigation clicks, form leads carry no source data,
and the owner's own visits are counted. Traffic is a few dozen real users a
month, so the design favours counts and a lead log over rates and trends.

## Scope

In scope: event schema rewrite, first-touch attribution on form leads,
internal-traffic exclusion, GA4 Admin configuration, a GA4 custom report
collection, tests, a privacy-policy sentence, docs.

Out of scope: Meta Pixel (stays disabled), Looker Studio, a weekly email
digest, a consent banner, any dashboard hosted on the site.

The working tree holds uncommitted buyers-guide work (new page, form, mirror
form in `index.html`). Analytics is implemented on top of it; the
buyers-guide work is committed first, on its own.

## Part 1 — Event schema

`src/lib/analytics.js` remains the single home for tracking. The public
API becomes:

```js
initAnalytics()                  // unchanged contract
trackPageView(path)              // unchanged contract
track(eventName, params = {})    // replaces trackEvent(action, category, label)
getAttribution()                 // new, see Part 2
```

`track` merges three context parameters into every event before sending:

| Parameter      | Values                                               | Source |
|----------------|------------------------------------------------------|--------|
| `page_type`    | `home`, `town`, `buyers_guide`, `valuation`, `legal`, `not_found` | derived from current pathname via the same slug list the router uses |
| `town`         | community slug or `""`                               | pathname |
| `first_source` | see Part 2                                           | sessionStorage |

Event names and their own parameters:

| Event           | Parameters                                   | Replaces |
|-----------------|----------------------------------------------|----------|
| `page_view`     | `page_path`, `page_location`, `page_title` + context | unchanged event, gains context |
| `generate_lead` | `form_name` (`contact`, `home-valuation`, `buyers-guide`), `interest` | `form_submit` |
| `phone_click`   | `placement`                                  | `click/Contact/Phone_*` |
| `email_click`   | `placement`                                  | `click/Contact/Email*` |
| `cta_click`     | `cta` (`schedule`, `search`, `read_guide`, `connect`), `placement` | `click/CTA/*` |
| `social_click`  | `network` (`instagram`, `linkedin`, `x`, `google_reviews`), `placement` | `click/Social/*` |

`placement` values: `hero`, `nav`, `footer`, `contact`, `bottom_cta`,
`mobile_bar`, `guide`, `valuation`. Town is never encoded into a label
again; it is always the `town` context parameter.

All ~30 call sites in `Nav`, `Footer`, `Home`, `TownPage`, `HomeValuation`,
`BuyersGuide`, `ContactForm`, `GuideForm` are rewritten to the new
signature. The prop passed down is renamed from `trackEvent` to `track`.

Meta Pixel block is retained unchanged except that `generate_lead` maps to
the Pixel `Lead` event and `cta_click` to `ViewContent`.

## Part 2 — Lead attribution and internal traffic

### First-touch capture

On `initAnalytics()`, if `sessionStorage` has no `nl_attr` entry, compute
and store:

| Field          | Rule |
|----------------|------|
| `landing_page` | `location.pathname` |
| `source`       | `utm_source` if present; else referrer host mapped: `instagram.com`→`instagram`, `l.instagram.com`→`instagram`, `google.*`→`google`, `facebook.com`/`l.facebook.com`→`facebook`, `linkedin.com`/`lnkd.in`→`linkedin`, `t.co`/`x.com`→`x`, `compass.com`→`compass`, same host→ignored, empty→`direct`, anything else→bare host |
| `medium`       | `utm_medium` if present; else `social`, `organic`, `referral`, or `none` by the same mapping |
| `campaign`     | `utm_campaign` or `""` |
| `referrer`     | `document.referrer` or `""` |

`first_source` on every event is `source` from this record. If
`sessionStorage` throws (private mode, blocked), the record is held in
memory for the page lifetime and nothing errors.

### Forms

`submitNetlifyForm(formName, fields)` spreads `getAttribution()` into the
body, so all three forms carry the five fields without per-form changes.
The three hidden mirror forms in `index.html` (`contact`, `home-valuation`,
`buyers-guide`) each gain:

```html
<input type="hidden" name="landing_page" />
<input type="hidden" name="source" />
<input type="hidden" name="medium" />
<input type="hidden" name="campaign" />
<input type="hidden" name="referrer" />
```

`netlify/functions/submission-created.js` renders an "Attribution" block
after the form fields in both the text and HTML email, showing the five
values (dash when empty). `scripts/export-leads.mjs` already flattens every
field; it is updated only to append these five columns last, in a fixed
order.

### Internal traffic

`initAnalytics()` sets `localStorage.nl_internal = "1"` when the URL has
`?internal=1`, when `location.hostname` is `localhost`, or when the hostname
ends in `.netlify.app` (deploy previews). When the flag is set, the gtag
`config` call and every event include `traffic_type: "internal"`. GA4's
built-in internal-traffic rule on `traffic_type=internal` is switched to
Active in Admin (Part 3). `?internal=0` clears the flag.

## Part 3 — GA4 configuration and reports

Performed in GA4 Admin by Claude driving the owner's logged-in Chrome
session, after the code has been deployed and has sent at least one of each
event (GA4 only lets a parameter be registered once seen).

1. **Custom dimensions** (event scope): `page_type`, `town`,
   `first_source`, `placement`, `form_name`, `cta`, `network`.
2. **Key events**: `generate_lead`, `phone_click`, `email_click`.
3. **Data filter**: Internal Traffic → state Active.
4. **Library → new collection "Leads"**, published to the left nav, with
   four detail reports:

| Report          | Primary dimension | Metrics |
|-----------------|-------------------|---------|
| Lead sources    | `first_source`    | key events by name (generate_lead, phone_click, email_click), total users |
| Town pages      | `town`            | total users, views, generate_lead, phone_click, average engagement time |
| Monthly         | month             | total users, new users, generate_lead, phone_click + email_click |
| Contact actions | `placement`       | phone_click, email_click |

Dimensions apply only to data collected after registration; reports start
clean from that date. The configuration is recorded in `README.md` so a
future rename of any parameter is known to break a report.

## Part 4 — Verification, privacy, docs

### Tests

Add Vitest as a dev dependency with `npm test`. `src/lib/analytics.test.js`
covers:

- source/medium derivation for each referrer rule and for UTM override
- first-touch is written once and not overwritten on later navigations
- storage throwing falls back to memory without error
- internal flag set/cleared by query param and hostname rules
- `track` attaches `page_type`, `town`, `first_source`, and `traffic_type`
  (only when internal) to the gtag call
- `getAttribution()` returns the five fields with empty-string defaults

### Live check (deploy preview, before merge)

In Chrome with the internal flag cleared: load a town page from a URL with
UTM params, tap a phone link, submit a test contact form. Confirm in the
network log that gtag requests carry the new parameters, confirm the lead
email shows the Attribution block, then delete the test submission in
Netlify Forms.

### GA4 check (after Part 3)

Realtime shows events with their registered dimensions. Then set the
internal flag on the owner's devices by visiting `/?internal=1` on each.

### Privacy policy

Append one sentence to the "Analytics and cookies" paragraph of
`src/pages/PrivacyPolicy.jsx`: "When you submit a form, we also record the
page you arrived on and the site or campaign that referred you, so we know
how you found us." Update the revised date.

### Docs

`README.md`: replace the analytics line with the event table and the GA4
setup record. `OVERHAUL_NOTES.md` analytics section: same, briefly.

## Delivery

Single branch `analytics-v2` off `main`, one PR. Netlify builds the deploy
preview for the live check. Merge to `main` deploys to production. GA4
Admin configuration follows the production deploy.
