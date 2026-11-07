#!/usr/bin/env bash
# Copies the production D1 database into a fresh database named $1 (for
# example eligundry-pr-123), replacing any earlier copy, and prints its ID.
# Needs CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID.
set -euo pipefail

name="$1"
source_db="${SOURCE_DB:-eligundry}"
dump="$(mktemp -d)/dump.sql"
wrangler="pnpm exec wrangler"

uuid_of() {
  $wrangler d1 list --json |
    node -e 'const name = process.argv[1]; let s = ""; process.stdin.on("data", (d) => (s += d)).on("end", () => { const db = JSON.parse(s).find((d) => d.name === name); if (db) console.log(db.uuid) })' "$1"
}

if [ -n "$(uuid_of "$name")" ]; then
  $wrangler d1 delete "$name" --skip-confirmation >&2
fi

$wrangler d1 create "$name" >&2
$wrangler d1 export "$source_db" --remote --output "$dump" >&2
$wrangler d1 execute "$name" --remote --file "$dump" --yes >&2

uuid_of "$name"
