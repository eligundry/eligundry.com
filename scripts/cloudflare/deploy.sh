#!/usr/bin/env bash
# The Workers Builds deploy command, for main.
set -euo pipefail
cd "$(dirname "$0")/../.."

pnpm exec wrangler deploy --config dist/server/wrangler.json
