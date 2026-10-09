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
If you add a field, add it in both places. Email notifications are configured in the
Netlify dashboard.

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
2. That's it: the route, nav dropdown, mobile menu, footer, 404 links and sitemap all derive from it.

## Deploy

Netlify builds from the Git repo (`netlify.toml`). Pushing to `main` deploys production.
