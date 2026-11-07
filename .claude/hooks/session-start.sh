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

# Secrets live encrypted in .env.secrets. With DOTENV_PRIVATE_KEY_SECRETS set
# on the cloud environment, put them in the session's shell so ad hoc
# wrangler and drizzle-kit commands work too. The package scripts decrypt the
# file themselves.
if [ -n "${DOTENV_PRIVATE_KEY_SECRETS:-}" ] && [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  node scripts/secrets-to-shell.mjs >> "$CLAUDE_ENV_FILE"
  echo "Loaded .env.secrets into the session environment."
fi
