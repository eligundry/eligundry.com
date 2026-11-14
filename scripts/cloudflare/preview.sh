#!/usr/bin/env bash
# The Workers Builds preview (non-production branch) deploy command. Uploads a
# version bound to the branch's database copy at
# https://<branch>-eligundry.<subdomain>.workers.dev, then reports it to GitHub
# as a commit status so Playwright runs against it.
set -euo pipefail
cd "$(dirname "$0")/../.."

# Re-run this script with .env.secrets decrypted, as build.sh does.
if [ -z "${SECRETS_LOADED:-}" ]; then
  exec pnpm exec dotenvx run -q -f .env.secrets -- env SECRETS_LOADED=1 scripts/cloudflare/preview.sh "$@"
fi

source scripts/cloudflare/branch.sh

pnpm exec wrangler versions upload \
  --config dist/server/wrangler.preview.json \
  --preview-alias "$slug" \
  --message "$branch @ ${WORKERS_CI_COMMIT_SHA:0:7}" | tee upload.log

url="$(grep -o "https://$slug-[^ ]*workers.dev" upload.log | head -1)"
scripts/cloudflare/github-status.sh "$url"
