#!/usr/bin/env bash
# The Workers Builds deploy command for main, and `pnpm run deploy` after a
# local build. Uploads the Worker's runtime secrets from .env.secrets along
# with it, so they never have to be set by hand.
set -euo pipefail
cd "$(dirname "$0")/../.."
source scripts/cloudflare/load-secrets.sh

secrets="$(mktemp)"
trap 'rm -f "$secrets"' EXIT
node -e '
  const keys = ["LAST_FM_API_KEY", "BASIC_AUTH_USERNAME", "BASIC_AUTH_PASSWORD", "BLUESKY_USERNAME", "BLUESKY_PASSWORD", "DEPLOY_HOOK_URL"]
  const missing = keys.filter((k) => !process.env[k] || process.env[k].startsWith("encrypted:"))
  if (missing.length) throw new Error(`Missing secrets: ${missing.join(", ")}`)
  require("fs").writeFileSync(process.argv[1], JSON.stringify(Object.fromEntries(keys.map((k) => [k, process.env[k]]))))
' "$secrets"

pnpm exec wrangler deploy --config dist/server/wrangler.json --secrets-file "$secrets"
