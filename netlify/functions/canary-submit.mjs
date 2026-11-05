// Scheduled: submit the weekly canary lead through the real form endpoint.
// See netlify/lib/canary.js. Pair: canary-check.mjs runs 30 minutes later.
import { getStore } from '@netlify/blobs';
import { canaryFormBody, STORE_NAME, SITE_URL } from '../lib/canary.js';

export default async () => {
  const now = new Date();
  const store = getStore(STORE_NAME);
  let submitStatus = 0;
  let error = null;
  try {
    const res = await fetch(`${SITE_URL}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        Referer: `${SITE_URL}/`,
      },
      body: canaryFormBody(now),
    });
    submitStatus = res.status;
  } catch (err) {
    error = String(err);
  }
  await store.setJSON('pending', { submittedAt: now.toISOString(), submitStatus, error });
  console.log(`canary-submit: POST ${SITE_URL}/ -> ${submitStatus}${error ? ` (${error})` : ''}`);
  return new Response('ok');
};

export const config = { schedule: '0 12 * * 1' }; // Mondays 12:00 UTC (7 AM ET winter / 8 AM EDT)
