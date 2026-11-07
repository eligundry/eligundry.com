#!/usr/bin/env bash
# The Workers Builds deploy command for main. `pnpm run deploy` runs it after a
# local build. The Worker's runtime secrets are set on the Worker itself
# (`wrangler secret put`), not uploaded from here.
set -euo pipefail
cd "$(dirname "$0")/../.."

pnpm exec wrangler deploy --config dist/server/wrangler.json
