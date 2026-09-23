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
```

## Structure

```
index.html                  static head tags, font links, hidden Netlify mirror forms
netlify.toml                build command, publish dir, SPA redirect, headers
scripts/generate-sitemap.mjs  writes public/sitemap.xml from src/data/towns.js (runs on prebuild)
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
    analytics.js            GA4 + Meta Pixel (set FB_PIXEL_ID to enable the pixel)
    netlifyForms.jsx        shared form POST + honeypot field
    useMediaQuery.js
  data/
    towns.js                the six community pages (adds routes, nav, footer, sitemap)
originals-fullres/          full-resolution photo originals (git-ignored)
```

## Forms

Both forms POST to Netlify Forms. The field names sent from React **must** match the
hidden mirror forms in `index.html` (`contact`: name, email, phone, interest;
`home-valuation`: address, zipCode, name, email, phone; both include `bot-field`).
If you add a field, add it in both places. Email notifications are configured in the
Netlify dashboard.

## Adding a community

1. Add an entry to `src/data/towns.js`.
2. That's it: the route, nav dropdown, mobile menu, footer, 404 links and sitemap all derive from it.

## Deploy

Netlify builds from the Git repo (`netlify.toml`). Pushing to `main` deploys production.
