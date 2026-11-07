#!/usr/bin/env bash
# The Workers Builds deploy command, for main.
set -euo pipefail
cd "$(dirname "$0")/../.."

pnpm exec wrangler deploy --config dist/server/wrangler.json
scripts/cloudflare/github-deployment.sh production "${SITE_URL:-https://eligundry.eligundry.workers.dev}"
