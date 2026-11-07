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

# The cloud environment's variables are already in the shell. `pnpm dev` sets
# CLOUDFLARE_INCLUDE_PROCESS_ENV, so the local Worker sees them too.
