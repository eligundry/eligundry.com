#!/bin/bash
set -euo pipefail

# Only run in Claude Code on the web (remote) sessions.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Run asynchronously so the session doesn't block on setup.
echo '{"async": true, "asyncTimeout": 300000}'

cd "$CLAUDE_PROJECT_DIR"

pnpm install

# The cloud environment's variables (CLOUDFLARE_API_TOKEN,
# CLOUDFLARE_ACCOUNT_ID, LAST_FM_API_KEY, ...) are already in the shell, which
# is all builds, scripts, wrangler and drizzle-kit need. `astro dev` runs the
# site in workerd, which only sees variables listed in .dev.vars, so copy the
# ones the Worker reads there.
: > .dev.vars
for key in LAST_FM_API_KEY BASIC_AUTH_USERNAME BASIC_AUTH_PASSWORD \
  BLUESKY_USERNAME BLUESKY_PASSWORD NOTION_TOKEN NOTION_LINKS_DATABASE_ID \
  STANDARD_SITE_DID STANDARD_SITE_PUBLICATION_RKEY; do
  if [ -n "${!key:-}" ]; then
    printf '%s=%q\n' "$key" "${!key}" >> .dev.vars
  fi
done
echo "Wrote .dev.vars from the environment."
