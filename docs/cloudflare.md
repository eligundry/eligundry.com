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
`BLUESKY_PASSWORD` and `GITHUB_DEPLOY_TOKEN` (a fine-grained token with
Actions read and write on this repo, used to dispatch `deploy.yml`).

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

`.github/workflows/deploy.yml`:

- **Pushes to main** and `workflow_dispatch` build against production D1 and
  run `wrangler deploy`. Daylio uploads and the nightly cron dispatch the
  workflow (`src/lib/rebuild.ts`).
- **Pull requests** copy production D1 into `eligundry-pr-<number>` on every
  push (`scripts/cloudflare/fork-d1.sh`), build against it, and upload a
  preview version at `https://pr-<number>-eligundry.<subdomain>.workers.dev`
  bound to it. The copy is deleted when the pull request closes.
- Playwright then runs against whatever was deployed.

GitHub Actions secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`,
`LAST_FM_API_KEY`, `NOTION_TOKEN`, `NOTION_LINKS_DATABASE_ID`,
`BLUESKY_USERNAME`, `BLUESKY_PASSWORD`, `STANDARD_SITE_DID`,
`STANDARD_SITE_PUBLICATION_RKEY`.

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
