// Single home for third-party analytics: Google Analytics 4 (+ dormant Meta Pixel).
//
// - initAnalytics() loads the tag once, records first-touch attribution for
//   the session, and resolves the internal-traffic flag.
// - trackPageView() is called by App on every route change so SPA
//   navigations are counted (gtag's automatic page_view only fires once).
// - track(name, params) is passed down to components. Every event carries
//   page_type, town and first_source so GA4 can group by them.
// - getAttribution() returns the first-touch record (landing_page, source,
//   medium, campaign, referrer_url; named referrer_url because Netlify Forms
//   reserves `referrer` for the HTTP Referer); netlifyForms spreads it
//   into every lead so the lead email and CSV show where it came from.
//
// Event vocabulary (see docs/superpowers/specs/2026-10-09-analytics-design.md):
//   generate_lead { form_name, interest }
//   phone_click   { placement }
//   email_click   { placement }
//   cta_click     { cta, placement }
//   social_click  { network, placement }

import { towns } from '../data/towns';

export const GA_MEASUREMENT_ID = 'G-1FTQ8KS469';

// Set to your Meta Pixel ID (e.g. '1234567890') to enable Facebook tracking. Leave empty to disable.
export const FB_PIXEL_ID = '';

const ATTR_KEY = 'nl_attr';
const INTERNAL_KEY = 'nl_internal';
const EMPTY_ATTRIBUTION = Object.freeze({ landing_page: '', source: '', medium: '', campaign: '', referrer_url: '' });

// ---------------------------------------------------------------------------
// Pure helpers (unit tested in analytics.test.js)
// ---------------------------------------------------------------------------

const LEGAL_PATHS = new Set(['/privacy', '/terms']);

// Classify the current route so every event can be grouped by page type and
// town without regex on URLs inside GA4.
export function pageContext(pathname) {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (path === '/') return { page_type: 'home', town: '' };
  if (path === '/home-valuation') return { page_type: 'valuation', town: '' };
  if (LEGAL_PATHS.has(path)) return { page_type: 'legal', town: '' };
  const [, slug, rest] = path.split('/');
  if (!towns[slug]) return { page_type: 'not_found', town: '' };
  if (rest === undefined) return { page_type: 'town', town: slug };
  if (rest === 'buyers-guide') return { page_type: 'buyers_guide', town: slug };
  return { page_type: 'not_found', town: '' };
}

// Known referrer hosts → [source, medium]. Checked by suffix so subdomains
// (l.instagram.com, www.linkedin.com) match.
const REFERRER_RULES = [
  ['instagram.com', 'instagram', 'social'],
  ['facebook.com', 'facebook', 'social'],
  ['linkedin.com', 'linkedin', 'social'],
  ['lnkd.in', 'linkedin', 'social'],
  ['t.co', 'x', 'social'],
  ['x.com', 'x', 'social'],
  ['twitter.com', 'x', 'social'],
  ['compass.com', 'compass', 'referral'],
];

function hostMatches(host, suffix) {
  return host === suffix || host.endsWith('.' + suffix);
}

function classifyReferrer(referrer, ownHost) {
  if (!referrer) return ['direct', 'none'];
  let host;
  try {
    host = new URL(referrer).hostname.toLowerCase();
  } catch {
    return ['direct', 'none'];
  }
  if (hostMatches(host, ownHost)) return ['direct', 'none'];
  if (/(^|\.)google\.[a-z.]+$/.test(host)) return ['google', 'organic'];
  for (const [suffix, source, medium] of REFERRER_RULES) {
    if (hostMatches(host, suffix)) return [source, medium];
  }
  return [host.replace(/^www\./, ''), 'referral'];
}

const clean = (v) => (v || '').trim().toLowerCase();

// First-touch attribution for a visit. UTM parameters win; otherwise the
// referrer host decides source and medium.
export function deriveAttribution({ pathname, search, referrer, hostname }) {
  const params = new URLSearchParams(search || '');
  const [refSource, refMedium] = classifyReferrer(referrer || '', (hostname || '').toLowerCase());
  return {
    landing_page: pathname || '/',
    source: clean(params.get('utm_source')) || refSource,
    medium: clean(params.get('utm_medium')) || refMedium,
    campaign: clean(params.get('utm_campaign')),
    referrer_url: referrer || '',
  };
}

// ---------------------------------------------------------------------------
// Storage (never throws: private mode / blocked storage falls back to memory)
// ---------------------------------------------------------------------------

function read(storage, key) {
  try { return window[storage].getItem(key); } catch { return null; }
}
function write(storage, key, value) {
  try { window[storage].setItem(key, value); } catch { /* memory only */ }
}
function remove(storage, key) {
  try { window[storage].removeItem(key); } catch { /* memory only */ }
}

// ---------------------------------------------------------------------------
// Runtime state
// ---------------------------------------------------------------------------

let initialized = false;
let attribution = EMPTY_ATTRIBUTION;
let internal = false;

export function getAttribution() {
  return { ...attribution };
}

export function isInternal() {
  return internal;
}

function resolveAttribution(location, referrer) {
  const stored = read('sessionStorage', ATTR_KEY);
  if (stored) {
    try { return { ...EMPTY_ATTRIBUTION, ...JSON.parse(stored) }; } catch { /* fall through */ }
  }
  const fresh = deriveAttribution({
    pathname: location.pathname,
    search: location.search,
    referrer,
    hostname: location.hostname,
  });
  write('sessionStorage', ATTR_KEY, JSON.stringify(fresh));
  return fresh;
}

// Internal traffic: the owner's own devices (flagged once via ?internal=1),
// localhost, and Netlify deploy previews. GA4's internal-traffic filter drops
// hits carrying traffic_type=internal.
function resolveInternal(location) {
  const flag = new URLSearchParams(location.search).get('internal');
  if (flag === '1') write('localStorage', INTERNAL_KEY, '1');
  if (flag === '0') remove('localStorage', INTERNAL_KEY);
  if (flag === '1') return true;
  if (flag === '0') return false;
  const host = location.hostname;
  if (host === 'localhost' || host === '127.0.0.1' || host.endsWith('.netlify.app')) return true;
  return read('localStorage', INTERNAL_KEY) === '1';
}

function context() {
  const params = { ...pageContext(window.location.pathname), first_source: attribution.source };
  if (internal) params.traffic_type = 'internal';
  return params;
}

// `env` is injectable for tests; production callers pass nothing.
export function initAnalytics({ location = window.location, referrer = document.referrer } = {}) {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  attribution = resolveAttribution(location, referrer);
  internal = resolveInternal(location);

  if (GA_MEASUREMENT_ID) {
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    // Page views are sent explicitly from trackPageView on each route change.
    const config = { send_page_view: false };
    if (internal) config.traffic_type = 'internal';
    window.gtag('config', GA_MEASUREMENT_ID, config);
  }

  if (FB_PIXEL_ID) {
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', FB_PIXEL_ID);
  }
}

export function trackPageView(path) {
  if (typeof window === 'undefined' || !initialized) return;
  if (window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
      ...context(),
    });
  }
  if (window.fbq && FB_PIXEL_ID) {
    window.fbq('track', 'PageView');
  }
}

export function track(name, params = {}) {
  if (typeof window === 'undefined' || !initialized) return;
  if (window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', name, { ...params, ...context() });
  }
  if (window.fbq && FB_PIXEL_ID) {
    if (name === 'generate_lead') window.fbq('track', 'Lead');
    else if (name === 'cta_click') window.fbq('track', 'ViewContent');
  }
}
