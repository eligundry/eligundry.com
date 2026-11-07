#!/usr/bin/env bash
# Applies this branch's pending migrations to the D1 database named $1 with ID
# $2, such as a preview copy from fork-d1.sh. `wrangler d1 migrations apply`
# only finds databases in a config, so this writes a throwaway one for it.
# Needs CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID.
set -euo pipefail
cd "$(dirname "$0")/../.."

name="$1"
id="$2"
config="$(mktemp -d)/wrangler.json"

cat >"$config" <<JSON
{
  "name": "migrate",
  "compatibility_date": "2026-01-01",
  "d1_databases": [
    { "binding": "DB", "database_name": "$name", "database_id": "$id", "migrations_dir": "$PWD/migrations" }
  ]
}
JSON

CI=1 pnpm exec wrangler d1 migrations apply "$name" --remote --config "$config" >&2
