# Sourced by the Workers Builds scripts. Sets:
#   branch   the git branch being built
#   slug     the branch as a preview alias (lowercase letters, digits, dashes)
#   preview_db  the name of the branch's copy of the production database
branch="${WORKERS_CI_BRANCH:-$(git branch --show-current)}"
slug="$(printf '%s' "$branch" | tr '[:upper:]' '[:lower:]' | tr -c 'a-z0-9' '-' | sed -E 's/-+/-/g; s/^-//; s/-$//' | cut -c1-40 | sed 's/-$//')"
preview_db="eligundry-br-$slug"
