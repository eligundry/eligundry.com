#!/usr/bin/env bash
# Records a successful deploy of WORKERS_CI_COMMIT_SHA to GitHub as a
# deployment in environment $1 at URL $2. That shows it on the pull request
# and starts .github/workflows/playwright.yml. Needs GITHUB_DEPLOY_TOKEN, a
# fine-grained token with Deployments read and write on this repository;
# without it this does nothing.
set -euo pipefail
# The deploy already happened, so a GitHub hiccup shouldn't fail the build
trap 'echo "Could not post the GitHub deployment" >&2; exit 0' ERR

environment="$1"
url="$2"
sha="${WORKERS_CI_COMMIT_SHA:-$(git rev-parse HEAD)}"
api="https://api.github.com/repos/eligundry/eligundry.com"

if [ -z "${GITHUB_DEPLOY_TOKEN:-}" ] || [ -z "$url" ]; then
  echo "Skipping the GitHub deployment (no GITHUB_DEPLOY_TOKEN or URL)" >&2
  exit 0
fi

github() {
  curl -fsS -X POST "$api/$1" \
    -H "Authorization: Bearer $GITHUB_DEPLOY_TOKEN" \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    -H "Content-Type: application/json" \
    -d "$2"
}

payload="$(node -e 'console.log(JSON.stringify({ ref: process.argv[1], environment: process.argv[2], auto_merge: false, required_contexts: [], transient_environment: process.argv[2] !== "production", production_environment: process.argv[2] === "production" }))' "$sha" "$environment")"
id="$(github deployments "$payload" | node -e 'let s = ""; process.stdin.on("data", (d) => (s += d)).on("end", () => console.log(JSON.parse(s).id))')"
github "deployments/$id/statuses" "$(node -e 'console.log(JSON.stringify({ state: "success", environment_url: process.argv[1], auto_inactive: true }))' "$url")" > /dev/null
echo "Posted GitHub deployment $id ($environment: $url)"
