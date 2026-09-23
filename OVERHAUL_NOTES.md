# Nicholas Liappas Real Estate Site - Complete Overhaul

> Historical notes from the April 2026 multi-page overhaul. Updated September 2026
> after the audit; see README.md for the current structure and workflow.

## Overview
This site has been completely restructured from a single-page React app into a multi-page application with routing using React Router v6.

## Project Structure

```
src/
├── App.jsx                    # Main router and app wrapper
├── main.jsx                   # Entry point with BrowserRouter
├── components/
│   ├── Nav.jsx               # Navigation with Communities dropdown + mobile menu
│   ├── Footer.jsx            # Footer with links to all towns
│   ├── ContactForm.jsx       # Reusable contact form
│   ├── ScrollManager.jsx     # Scroll-to-top / hash scrolling on navigation
│   └── styles.js             # Shared style objects
├── pages/
│   ├── Home.jsx              # Homepage (original content)
│   ├── TownPage.jsx          # Parameterized town landing pages
│   ├── HomeValuation.jsx     # Multi-step home valuation form
│   └── NotFound.jsx          # 404 page
├── lib/
│   ├── seo.js                # useSeo() per-route head tags
│   ├── analytics.js          # GA4 + Meta Pixel
│   ├── netlifyForms.jsx      # Shared form POST + honeypot
│   └── useMediaQuery.js
└── data/
    └── towns.js              # Town data for 6 communities
```

## Routes

- `/` → Home page
- `/:slug` → Town pages (manhasset, port-washington, roslyn, east-hills, glen-head, glenwood-landing)
- `/home-valuation` → Home valuation landing page
- anything else → 404 page (noindex)

## Key Features

### Navigation
- "Communities" dropdown in nav linking to all 6 town pages (mouse, keyboard and touch)
- Mobile menu at ≤1100px
- The "Blog" link was removed in the Sept 2026 audit: there is no blog section to link to

### Footer
- Dynamic copyright year: `© ${new Date().getFullYear()}`
- Links to all 6 town pages
- Service area links
- Social media links
- Contact information

### Town Pages
Each town has:
- Unique H1: `{townName} Real Estate`
- Unique title tag
- Unique meta description
- Town description and highlights
- Market snapshot (avg price, zip code, property style)
- CTA section with embedded ContactForm
- "Browse Other Communities" section
- LocalBusiness schema markup with geo coordinates

### Home Valuation Page
3-step form with:
- Step 1: Address and zip code
- Step 2: Name and email  
- Step 3: Review and submit
- Thank you message
- "Why Get a Home Valuation" section
- Seller testimonials
- Form submits to Netlify Forms

## SEO Updates

### Meta Tags
- Added East Hills, Glen Head, Glenwood Landing to meta keywords
- Added these communities to meta description
- Each page has unique meta tags

### Schema Markup
- Updated areaServed to include 3 new communities
- Town pages have LocalBusiness schema with:
  - Town name
  - Coordinates (lat/lng)
  - Address with town-specific zip code
  - Service area set to specific town

### H2 Tags
- Team section: "Your Trusted North Shore Real Estate Team"
- Services section: "Full-Service Real Estate Solutions"

## Form Handling

### Contact Form
- Hidden form in index.html for Netlify detection
- Form name: "contact"
- Fields: name, email, phone, interest, bot-field (honeypot)

### Home Valuation Form
- Hidden form in index.html for Netlify detection
- Form name: "home-valuation"
- Fields: address, zipCode, name, email, phone, bot-field (honeypot)
- Tracks "Lead" event in Facebook Pixel

Both submit through `src/lib/netlifyForms.jsx`.

## Analytics

### Google Analytics
- GA4 tracking maintained
- `trackEvent()` function passes events to GA4
- Tracks: form submissions, CTA clicks, social clicks, contact clicks

### Facebook Pixel
- Disabled until `FB_PIXEL_ID` in `src/lib/analytics.js` is set
- Tracks:
  - PageView (every route change)
  - Lead (on form submission)

## Dependencies Added

- `react-router-dom@^6.22.0`

Run `npm install` after pulling to install this dependency.

## Next Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Add Facebook Pixel ID**
   - Set `FB_PIXEL_ID` in `/src/lib/analytics.js`

3. **Test locally**
   ```bash
   npm run dev
   ```
   - Visit http://localhost:5173
   - Test all routes:
     - http://localhost:5173/ (home)
     - http://localhost:5173/manhasset (town page)
     - http://localhost:5173/home-valuation (valuation page)

4. **Deploy**
   - Push to `main`; Netlify builds from Git (see `netlify.toml`)

5. **Monitor Performance**
   - Check new town pages in Google Search Console
   - Monitor home valuation page leads
   - Check Facebook Pixel is firing correctly

## Design Notes

- All styles use inline objects from `styles.js`
- Responsive design maintained across all pages
- Dark navy color scheme and fonts (Cormorant Garamond, Montserrat) preserved
- No CSS files needed - all styling is component-level

## Important Files Modified

- `package.json` - Added react-router-dom
- `src/main.jsx` - Added BrowserRouter wrapper
- `index.html` - Added home-valuation hidden form
- `sitemap.xml` - now generated by `scripts/generate-sitemap.mjs`

## Important Files Created

- All files in src/components/, src/pages/, src/data/
- New App.jsx with routing

## Maintenance

### Adding a New Town
1. Add entry to `/src/data/towns.js`
2. Route, nav, footer, 404 links and sitemap.xml (generated on build) all follow automatically

### Updating Shared Styles
- Edit `/src/components/styles.js`
- Changes apply to all pages automatically

### Updating Navigation
- Edit `/src/components/Nav.jsx`
- Communities dropdown automatically pulls from towns data

### Updating Footer
- Edit `/src/components/Footer.jsx`
- Links automatically pull from towns data

## Troubleshooting

### Route not working
- Ensure BrowserRouter is in main.jsx
- Check route path syntax in App.jsx
- Verify page component is imported

### Form not submitting
- Verify hidden form is in index.html with correct name attribute
- Check Netlify Forms is enabled in your netlify.toml
- Verify form.data-netlify="true" attribute

### Styles not applying
- Check styles.js is imported correctly
- Verify getStyles() is being called
- Ensure component receives isScrolled prop if needed

## Support

For questions about the overhaul or to add new features, refer to:
- React Router docs: https://reactrouter.com/
- React hooks: https://react.dev/reference/react/hooks
- Netlify Forms: https://docs.netlify.com/forms/setup/
