#!/usr/bin/env bash
# Uploads everything in media/ to the eligundry-media R2 bucket at the same
# path. Run with `pnpm media:sync`.
set -euo pipefail
cd "$(dirname "$0")/../.."
find media -type f | while read -r file; do
  pnpm exec wrangler r2 object put "eligundry-media/${file#media/}" --file "$file" --remote
done
