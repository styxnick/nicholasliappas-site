// Single home for third-party analytics: Google Analytics 4 + Meta Pixel.
//
// - initAnalytics() loads the tags once.
// - trackPageView() is called by App on every route change so SPA
//   navigations are counted (gtag's automatic page_view only fires once).
// - trackEvent() is passed down to components for clicks/form submits.

export const GA_MEASUREMENT_ID = 'G-1FTQ8KS469';

// Set to your Meta Pixel ID (e.g. '1234567890') to enable Facebook tracking. Leave empty to disable.
export const FB_PIXEL_ID = '';

let initialized = false;

export function initAnalytics() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  if (GA_MEASUREMENT_ID) {
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    // Page views are sent explicitly from trackPageView on each route change.
    window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });
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
  if (typeof window === 'undefined') return;
  if (window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
    });
  }
  if (window.fbq && FB_PIXEL_ID) {
    window.fbq('track', 'PageView');
  }
}

export function trackEvent(action, category, label) {
  if (typeof window === 'undefined') return;
  if (window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
    });
  }
  if (window.fbq && FB_PIXEL_ID) {
    if (action === 'form_submit') {
      window.fbq('track', 'Lead');
    } else if (action === 'click') {
      window.fbq('track', 'ViewContent');
    }
  }
}
