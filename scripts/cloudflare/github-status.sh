#!/usr/bin/env bash
# Reports a deployed preview to GitHub as a successful commit status on
# WORKERS_CI_COMMIT_SHA, with context cloudflare/eligundry/deploy-preview and
# the preview at URL $1, the way Netlify reported its deploy previews. That
# starts .github/workflows/playwright-preview.yml. Needs GITHUB_DEPLOY_TOKEN,
# a fine-grained token with Commit statuses read and write on this
# repository; without it this does nothing.
set -euo pipefail
# The deploy already happened, so a GitHub hiccup shouldn't fail the build
trap 'echo "Could not post the GitHub commit status" >&2; exit 0' ERR

url="$1"
sha="${WORKERS_CI_COMMIT_SHA:-$(git rev-parse HEAD)}"

if [ -z "${GITHUB_DEPLOY_TOKEN:-}" ] || [ -z "$url" ]; then
  echo "Skipping the GitHub commit status (no GITHUB_DEPLOY_TOKEN or URL)" >&2
  exit 0
fi

body="$(node -e 'console.log(JSON.stringify({ state: "success", context: "cloudflare/eligundry/deploy-preview", description: "Workers Builds preview is ready", target_url: process.argv[1] }))' "$url")"
curl -fsS -o /dev/null -X POST \
  "https://api.github.com/repos/eligundry/eligundry.com/statuses/$sha" \
  -H "Authorization: Bearer $GITHUB_DEPLOY_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  -H "Content-Type: application/json" \
  -d "$body"
echo "Posted the preview to GitHub as a commit status: $url"
