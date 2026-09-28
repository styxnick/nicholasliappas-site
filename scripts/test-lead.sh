#!/usr/bin/env bash
# Sends a fake lead through the live contact form. Within ~10s it should
# show up in Netlify Forms and land in the LEAD_TO inbox via Resend.
#   ./scripts/test-lead.sh              -> contact form
#   ./scripts/test-lead.sh valuation    -> home-valuation form
set -euo pipefail
SITE="${SITE_URL:-https://nicholasliappas.com}"
STAMP=$(date +"%b %-d %H:%M")
if [ "${1:-contact}" = "valuation" ]; then
  curl -sS -o /dev/null -w "home-valuation POST -> HTTP %{http_code}\n" -X POST "$SITE/" \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    --data-urlencode 'form-name=home-valuation' \
    --data-urlencode "name=TEST LEAD $STAMP (ignore)" \
    --data-urlencode 'email=nliappas@gmail.com' \
    --data-urlencode 'phone=5162147761' \
    --data-urlencode 'address=1468 Northern Blvd' \
    --data-urlencode 'zipCode=11030' \
    --data-urlencode 'bot-field='
else
  curl -sS -o /dev/null -w "contact POST -> HTTP %{http_code}\n" -X POST "$SITE/" \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    --data-urlencode 'form-name=contact' \
    --data-urlencode "name=TEST LEAD $STAMP (ignore)" \
    --data-urlencode 'email=nliappas@gmail.com' \
    --data-urlencode 'phone=5162147761' \
    --data-urlencode 'interest=buying' \
    --data-urlencode 'bot-field='
fi
echo "Sent \"TEST LEAD $STAMP (ignore)\". Check nicholas.liappas@compass.com; function log: netlify logs:function submission-created"
