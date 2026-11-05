// Server entry for build-time prerendering (scripts/prerender.mjs). Renders one
// route to static HTML and collects the <head> config every page declares via
// useSeo, so crawlers get the same title/meta/JSON-LD the browser would set.
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App.jsx';
import { collectSeo } from './lib/seo';

export function render(url) {
  const seo = [];
  const html = collectSeo(seo, () => renderToString(
    <StaticRouter location={url} future={{ v7_relativeSplatPath: true }}>
      <App />
    </StaticRouter>
  ));
  return { html, seo };
}
