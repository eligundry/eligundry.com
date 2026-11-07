#!/usr/bin/env bash
# The Workers Builds build command.
#
# main builds against the production database. Every other branch builds
# against a fresh copy of it, named eligundry-br-<branch>, and without the
# Bluesky credentials so it never publishes. The copy is deleted when the
# branch's pull request closes (.github/workflows/preview-cleanup.yml).
set -euo pipefail
cd "$(dirname "$0")/../.."
source scripts/cloudflare/branch.sh

# src/lib/lastModified.ts dates every page from its git history, so a shallow
# clone would date the whole sitemap today.
if [ "$(git rev-parse --is-shallow-repository)" = "true" ]; then
  git fetch --unshallow --quiet || echo "Could not fetch full git history" >&2
fi

if [ "$branch" != "main" ]; then
  echo "Copying the production database into $preview_db"
  D1_DATABASE_ID="$(scripts/cloudflare/fork-d1.sh "$preview_db")"
  export D1_DATABASE_ID
  unset BLUESKY_USERNAME BLUESKY_PASSWORD
fi

pnpm build

if [ "$branch" != "main" ]; then
  node scripts/cloudflare/preview-config.mjs "$D1_DATABASE_ID"
fi
