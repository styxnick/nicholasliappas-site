// Server-side per-route <head> for crawlers that don't run JavaScript
// (Facebook, iMessage, Slack, LinkedIn, Google's first pass). The React app
// sets the same tags client-side via src/lib/seo.js; this makes link previews
// and canonicals correct on the raw HTML too.
import { routeMeta, injectMeta } from '../../src/lib/routeMeta.js';

export default async (request, context) => {
  const meta = routeMeta(new URL(request.url).pathname);
  if (!meta) return context.next();

  const response = await context.next();
  const type = response.headers.get('content-type') || '';
  if (!type.includes('text/html')) return response;

  const html = await response.text();
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  return new Response(injectMeta(html, meta), { status: response.status, headers });
};

export const config = {
  path: '/*',
  excludedPath: ['/assets/*', '/commercial/*', '/video/*', '/.netlify/*', '/*.js', '/*.css', '/*.jpg', '/*.webp', '/*.png', '/*.svg', '/*.xml', '/*.txt', '/*.ico', '/*.mp4'],
};
