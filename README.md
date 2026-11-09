# nicholasliappas.com

Marketing site for Nicholas Liappas, Licensed Associate Real Estate Broker at Compass.

**Stack:** Vite 5 · React 18 · react-router-dom 6 · Netlify (hosting + Forms).
All styling is inline via `src/components/styles.js`; there are no CSS files apart from a
tiny global `<style>` block in `index.html` (focus ring, reduced motion).

## Scripts

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # regenerates public/sitemap.xml, then builds to dist/
npm run preview   # serve the production build locally
npm test          # Vitest unit tests (analytics, forms, lead email, CSV export)
```

## Structure

```
index.html                  static head tags, font links, hidden Netlify mirror forms
netlify.toml                build command, publish dir, SPA redirect, headers
scripts/generate-sitemap.mjs  writes public/sitemap.xml from src/data/towns.js (runs on prebuild)
scripts/export-leads.mjs    every Netlify Forms submission to one CSV (scripts/lead-row.mjs shapes rows)
public/                     images, favicon, robots.txt
src/
  main.jsx                  entry, BrowserRouter
  App.jsx                   routes, analytics init + page views
  components/
    Nav.jsx                 desktop nav w/ Communities dropdown, mobile menu (<=1100px)
    Footer.jsx
    ContactForm.jsx         "contact" Netlify form
    ScrollManager.jsx       scroll-to-top / scroll-to-#hash on navigation
    styles.js               shared inline style objects
  pages/
    Home.jsx
    TownPage.jsx            /:slug, data-driven from towns.js
    HomeValuation.jsx       "home-valuation" 3-step Netlify form
    NotFound.jsx            catch-all 404 (noindex)
  lib/
    seo.js                  useSeo(): per-route title/meta/canonical/OG/JSON-LD with cleanup
    analytics.js            GA4 events, first-touch attribution, internal-traffic flag (see Analytics)
    netlifyForms.jsx        shared form POST + honeypot field + attribution fields
    useMediaQuery.js
  data/
    towns.js                the six community pages (adds routes, nav, footer, sitemap)
originals-fullres/          full-resolution photo originals (git-ignored)
```

## Forms

Both forms POST to Netlify Forms. The field names sent from React **must** match the
hidden mirror forms in `index.html` (`contact`: name, email, phone, interest;
`home-valuation`: address, zipCode, name, email, phone; both include `bot-field`).
`netlifyForms.jsx` also appends five attribution fields to every submission
(`landing_page`, `source`, `medium`, `campaign`, `referrer_url`; not `referrer`, which Netlify reserves for the HTTP Referer), which each mirror form
declares as hidden inputs; `src/test/mirrorForms.test.js` enforces this.
If you add a field, add it in both places.

### What happens after a submission

`netlify/functions/submission-created.js` runs on every verified submission:

1. **Alert to Nicholas** via Resend (from `leads@nicholasliappas.com`), subject
   `New lead · Name · What`, with one-tap Call / Text / Email buttons.
2. **Confirmation to the lead** from `nicholas@nicholasliappas.com` (replies go to the
   Compass inbox), with copy specific to the form and interest. Builders live in
   `netlify/lib/lead-emails.js`; preview by rendering them in a test.
3. Optional phone push via ntfy.sh.

Env vars (Netlify → Site configuration → Environment variables):

| Var | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | yes | Resend API key for `nicholasliappas.com` |
| `LEAD_TO` | no | Override the alert recipient (default `nicholas.liappas@compass.com`) |
| `LEAD_ALERT_TO` | no | Extra alert recipients, comma-separated (second inbox, carrier SMS gateway) |
| `NTFY_TOPIC` | no | ntfy.sh topic for an instant phone push (first name + form only) |

### Weekly pipeline check (canary)

Two scheduled functions prove the whole path still works, every Monday:

- `canary-submit` (12:00 UTC) POSTs a lead named `Canary Check …` from
  `nliappas+canary@gmail.com` through the real form endpoint.
- `submission-created` recognises that address, sends both emails to the canary
  inbox instead of Nicholas, and records the Resend message ids in Netlify Blobs.
- `canary-check` (12:30 UTC) confirms the submission reached the function and that
  Resend reports both emails **delivered**. It emails Nicholas **only on failure**.

Logic is in `netlify/lib/canary.js` (tested in `src/test/canary.test.js`). The canary
records show up in Netlify Forms like any other submission; filter Gmail on
`to:nliappas+canary@gmail.com` to archive the weekly pair.

## Analytics

`src/lib/analytics.js` is the only place that talks to Google Analytics 4
(property `G-1FTQ8KS469`). Components receive a `track(name, params)` prop; every
event automatically carries `page_type` (home, town, buyers_guide, valuation, legal,
not_found), `town` (slug or empty) and `first_source`.

| Event           | Params                                   | Fired from |
|-----------------|------------------------------------------|------------|
| `page_view`     | page_path, page_location, page_title     | App on every route change |
| `generate_lead` | form_name, interest                      | ContactForm, HomeValuation |
| `phone_click`   | placement                                | tel: links |
| `email_click`   | placement                                | mailto: links |
| `cta_click`     | cta (schedule, search, connect), placement | buttons |
| `social_click`  | network (instagram, linkedin, x, google_reviews), placement | outbound social links |

`placement` values: hero, nav, footer, contact, bottom_cta, testimonials, valuation.

**First-touch attribution.** On the first page of a session the module stores
landing page, source, medium, campaign and referrer in `sessionStorage` (UTM
parameters win, otherwise the referrer host decides). `getAttribution()` returns it
and `netlifyForms.jsx` stamps it on every lead; the lead email and CSV export show it.

**Internal traffic.** Visiting any page with `?internal=1` sets a `localStorage`
flag (clear it with `?internal=0`); localhost and `*.netlify.app` previews are
flagged automatically. Flagged visits send `traffic_type=internal`, which GA4's
internal-traffic filter drops from reports. Set the flag once on each of your own
devices.

**GA4 configuration** (Admin, done once; re-do if an event or param is renamed):
custom dimensions `page_type`, `town`, `first_source`, `placement`, `form_name`,
`cta`, `network` (event scope); key events `generate_lead`, `phone_click`,
`email_click`; Data filter "Internal Traffic" set to Active; Library collection
"Leads" with reports Lead sources, Town pages, Monthly, Contact actions.

Tests: `npm test` (Vitest + jsdom).

## Adding a community

1. Add an entry to `src/data/towns.js`.
2. That's it: the route, nav dropdown, mobile menu, footer, 404 links, sitemap and prerender all derive from it.

## Relocation landing page

`/moving-to-long-island` (src/pages/Relocation.jsx, copy in src/data/relocation.js) is the landing page for NYC-buyer ad campaigns. It routes city buyers to town pages and buyer's guides and ends in the contact form with the interest preset to Relocation. Guides listed there come from `guides.js`.

## Buyer's guides

`src/data/guides.js` holds one entry per guide (Manhasset, Port Washington, Roslyn and East Hills). An entry may serve extra town pages via `alsoFor` (East Hills shares the Roslyn guide; `guideForTown(slug)` resolves it, and netlify.toml redirects the alias URL). Each entry
renders at `/<slug>/buyers-guide` (prerendered, in the sitemap) and adds a request section to
that town's page. Requests post to the `buyers-guide` Netlify form; `submission-created`
emails the lead the guide link and alerts Nicholas like any other lead.

## Deploy

Netlify builds from the Git repo (`netlify.toml`). Pushing to `main` deploys production.
