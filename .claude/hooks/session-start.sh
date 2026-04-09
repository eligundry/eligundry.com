#!/bin/bash
set -euo pipefail

# Only run in Claude Code on the web (remote) sessions.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# Install node dependencies. netlify-cli is a devDependency, so this also
# makes it available via `pnpm exec netlify`.
pnpm install

# Pull the dev context environment variables from Netlify and write a .env
# file, mirroring what .github/workflows/pull-request-ci.yml does. Requires
# NETLIFY_AUTH_TOKEN and NETLIFY_SITE_ID to be set as session secrets.
if [ -n "${NETLIFY_AUTH_TOKEN:-}" ] && [ -n "${NETLIFY_SITE_ID:-}" ]; then
  pnpm exec netlify env:list --plain > .env
  echo "Wrote .env from Netlify."
else
  echo "NETLIFY_AUTH_TOKEN or NETLIFY_SITE_ID not set; skipping .env generation." >&2
fi
