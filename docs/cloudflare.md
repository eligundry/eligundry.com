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

The Worker's runtime secrets (`LAST_FM_API_KEY`, `BASIC_AUTH_*`,
`BLUESKY_*`, and `DEPLOY_HOOK_URL`, the Workers Builds deploy hook for main
that the Daylio upload and the nightly cron call to rebuild) are set on the Worker
with `wrangler secret put` (or the API). See [Secrets](#secrets).

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
as its deploy command. Keep the dashboard's "Preview Builds" setting off: it
starts a second, default build of every branch, and turning it off deletes
every non-`main` trigger, so recreate "Previews" afterwards.

- **main** builds against production D1 and runs `wrangler deploy`. Daylio
  uploads and the nightly cron start a build through the deploy hook
  (`src/lib/rebuild.ts`).
- **Other branches** copy production D1 into `eligundry-br-<branch>` on every
  push (`scripts/cloudflare/fork-d1.sh`), build against it without the
  Bluesky credentials, and upload a version at
  `https://<branch>-eligundry.<subdomain>.workers.dev` bound to it.
- The build fetches full git history if the clone is shallow, since the
  sitemap dates pages from it.
- Each preview is reported to GitHub as a `cloudflare/eligundry/deploy-preview`
  commit status (`scripts/cloudflare/github-status.sh`), which starts
  `.github/workflows/playwright-preview.yml` against its URL. Like any
  `status` workflow, it runs from main's copy of the file.
- `.github/workflows/preview-cleanup.yml` deletes a branch's database copy
  when its pull request closes.

The build and preview commands decrypt `.env.secrets` (see
[Secrets](#secrets)), so Workers Builds needs only one build variable,
`DOTENV_PRIVATE_KEY_SECRETS`, on both triggers.
Build variables set on Workers Builds win over the file. The main build
still has the full set from before (`CLOUDFLARE_API_TOKEN`,
`CLOUDFLARE_ACCOUNT_ID`, `LAST_FM_API_KEY`, `NOTION_*`, `BLUESKY_*`,
`STANDARD_SITE_*` and `GITHUB_DEPLOY_TOKEN`, a fine-grained token with Commit
statuses read and write on this repo).

## Big media

Files over 25 MiB live in `media/` and are served from R2 by
`src/pages/video/[...path].ts`, which supports range requests. Upload new
ones with `pnpm media:sync`.

## Secrets

Development secrets live in one file, `.env.secrets`, committed and encrypted
with [dotenvx](https://dotenvx.com). One private key,
`DOTENV_PRIVATE_KEY_SECRETS`, decrypts it. Workers Builds uses it too
(above). The Worker's runtime secrets are still set on the Worker directly.
Set the key wherever the file is read:

| Where             | How                                               |
| ----------------- | ------------------------------------------------- |
| Local dev         | `.env.keys` (gitignored), or export the key       |
| Claude Code cloud | an environment variable on the cloud environment  |
| GitHub Actions    | a repository secret                               |
| Workers Builds    | a build variable on production and preview builds |

The package scripts (`dev`, `build`, `astro-check`, `drizzle:*`,
`goodreads:import`, `standard-site:*`, `media:sync`, `deploy`) run through
`dotenvx run`, which decrypts the file into the environment. Variables
already set in the shell win, so `D1_DATABASE_ID=... pnpm build` still works.
In a Claude Code session, `.claude/hooks/session-start.sh` also exports them
into the shell, so ad hoc `wrangler` commands work.

To add or change a secret, run `pnpm secrets:set KEY value`, which encrypts
it in place, and commit `.env.secrets`. If the Worker needs it at runtime, also
set it on the Worker with `wrangler secret put`.

## Developing in Claude Code cloud

Set `DOTENV_PRIVATE_KEY_SECRETS` on the cloud environment and that's it.
`pnpm dev` decrypts `.env.secrets` and sets `CLOUDFLARE_INCLUDE_PROCESS_ENV=true`
so the local Worker sees the secrets too.
