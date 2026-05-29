# standard.site (ATProto) Publishing

The site publishes its content to [ATProto](https://atproto.com/) using the
[standard.site](https://standard.site/) spec via
[`@bryanguffey/astro-standard-site`](https://github.com/musicjunkieg/astro-standard-site),
so posts are portable across standard.site readers (Leaflet, Pckt, etc.) and
can be discussed from Bluesky.

## What gets published

Automatically on each production build (best-effort and non-fatal — skipped
when credentials are absent):

- **Blog posts** and **Notion link posts** → `site.standard.document` records.
  Recent posts also get a Bluesky announcement post so replies show up as
  comments (alongside the existing [utteranc.es](https://utteranc.es/) thread).
- **Feelings** (Daylio entries) → documents, mirroring the `/feelings.rss` feed.

Each post carries a `site.standard.document` verification `<link>`, and
ownership is proven at `/.well-known/site.standard.publication`.

Publishing is deduped via a content hash stored in the `standard_site_documents`
table, so unchanged content is never re-published.

## How it works

- Core logic lives in `src/lib/standardSite.ts` (credential-agnostic publisher
  wrapper, content-hash dedupe, an announcement-age cutoff, and a per-build cap
  on feelings to avoid a large backfill burst).
- Publishing is triggered inside the prerendered page renders
  (`src/pages/blog/[...slug].astro`, `src/pages/blog/links/[slug].astro`,
  `src/pages/feelings.astro`), guarded by `import.meta.env.PROD`.
- Bluesky-powered comments render via `src/components/Post/Comments.astro`.

## Setup / configuration

Credentials are read from the environment (`import.meta.env` in Astro builds,
`process.env` for scripts):

- `BLUESKY_USERNAME` / `BLUESKY_PASSWORD` — Bluesky handle + app password
  (reused from the existing Bluesky integration).
- `STANDARD_SITE_DID` / `STANDARD_SITE_PUBLICATION_RKEY` — produced by the
  one-time setup script below.

One-time: publish the publication record and write the `STANDARD_SITE_*` vars
to Netlify (requires the `netlify` CLI to be linked):

```sh
pnpm standard-site:create-publication
```

## Publishing hand-made static pages

Blog/links/feelings publish automatically, but the artisanal static HTML pages
(`horses.html`, `web0.html`, `saturdays/*`, …) are published manually:

```sh
pnpm standard-site:publish-page src/pages/horses.html [more.html ...]
```
