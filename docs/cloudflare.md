# Cloudflare Workers + D1

The site runs as one Cloudflare Worker (`wrangler.jsonc`, entry
`src/worker.ts`). Astro prerenders almost every page at build time, in Node
(`prerenderEnvironment: 'node'`), and those ship as static assets. The Worker
serves the few on-demand routes and runs the cron jobs.

## Bindings

| Binding   | What                                                                      |
| --------- | ------------------------------------------------------------------------- |
| `DB`      | D1 database `eligundry`                                                   |
| `MEDIA`   | R2 bucket `eligundry-media`, for files over the 25 MiB static asset limit |
| `SESSION` | KV namespace the Astro adapter uses for sessions                          |
| `ASSETS`  | The built `dist/client`                                                   |

Worker secrets (`wrangler secret put`): `LAST_FM_API_KEY`,
`BASIC_AUTH_USERNAME`, `BASIC_AUTH_PASSWORD`, `BLUESKY_USERNAME`,
`BLUESKY_PASSWORD` and `DEPLOY_HOOK_URL` (the Workers Builds deploy hook for
main, which the Daylio upload and the nightly cron call to rebuild).

Server code reads secrets from `process.env`, never `import.meta.env`, because
Vite writes `import.meta.env` values into the bundle at build time.

## Database

`src/lib/database/index.ts` uses the `DB` binding inside the Worker and D1's
HTTP API everywhere else (the build, scripts, drizzle-kit), with
`CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`. `D1_DATABASE_ID` points
those at another database, such as a pull request's copy.

D1 has no interactive transactions, so multi-row writes go through
`db.batch`. A statement can bind at most 100 parameters, so big inserts are
chunked.

Migrations:

```sh
pnpm drizzle:migration:generate   # drizzle-kit writes migrations/NNNN_*.sql
pnpm drizzle:migration:apply      # wrangler applies them to production D1
```

## Crons

`src/worker.ts`'s `scheduled` handler maps each cron in `wrangler.jsonc` to a
job: the weekly, monthly and yearly Last.fm collages, and the nightly rebuild
that redeploys when the newest Daylio entry is stale. Collages render with
sharp at build time; the cron only posts them.

Workers run in UTC, so convert New York wall times with `fromZonedTime`.

## Deploys

Workers Builds (the Worker's Settings > Builds, connected to this repo) builds
and deploys every push:

| Setting         | Value                           |
| --------------- | ------------------------------- |
| Build command   | `scripts/cloudflare/build.sh`   |
| Deploy command  | `scripts/cloudflare/deploy.sh`  |
| Preview command | `scripts/cloudflare/preview.sh` |

There are two build triggers: one for `main`, which runs the deploy
command, and "Previews" for every other branch, which runs the preview command
as its deploy command.

- **main** builds against production D1 and runs `wrangler deploy`. Daylio
  uploads and the nightly cron start a build through the deploy hook
  (`src/lib/rebuild.ts`).
- **Other branches** copy production D1 into `eligundry-br-<branch>` on every
  push (`scripts/cloudflare/fork-d1.sh`), build against it without the
  Bluesky credentials, and upload a version at
  `https://<branch>-eligundry.<subdomain>.workers.dev` bound to it.
- The build fetches full git history if the clone is shallow, since the
  sitemap dates pages from it.
- Each deploy is recorded as a GitHub deployment
  (`scripts/cloudflare/github-deployment.sh`), which shows it on the pull
  request and starts `.github/workflows/playwright.yml` against its URL.
- `.github/workflows/preview-cleanup.yml` deletes a branch's database copy
  when its pull request closes.

Build variables and secrets (Settings > Builds): `CLOUDFLARE_API_TOKEN`,
`CLOUDFLARE_ACCOUNT_ID`, `LAST_FM_API_KEY`, `NOTION_TOKEN`,
`NOTION_LINKS_DATABASE_ID`, `BLUESKY_USERNAME`, `BLUESKY_PASSWORD`,
`STANDARD_SITE_DID`, `STANDARD_SITE_PUBLICATION_RKEY`, and
`GITHUB_DEPLOY_TOKEN` (a fine-grained token with Deployments read and write
on this repo).

GitHub Actions secrets, for `astro check` and the preview cleanup:
`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `LAST_FM_API_KEY`,
`NOTION_TOKEN`, `NOTION_LINKS_DATABASE_ID`.

## Big media

Files over 25 MiB live in `media/` and are served from R2 by
`src/pages/video/[...path].ts`, which supports range requests. Upload new
ones with `pnpm media:sync`.

## Developing in Claude Code cloud

Set `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` and the other secrets as
environment variables on the cloud environment. `.claude/hooks/session-start.sh`
installs dependencies and copies the Worker's secrets into `.dev.vars` for
`astro dev`. `pnpm build`, scripts, wrangler and drizzle-kit read the
environment directly and work against production D1.
