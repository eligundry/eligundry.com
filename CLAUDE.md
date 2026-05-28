# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `pnpm dev` or `pnpm start`
- **Build for production**: `pnpm build`
- **Preview production build**: `pnpm preview`
- **Run tests**: `pnpm test` (uses Vitest)
- **Lint code**: `pnpm lint` (ESLint)
- **Type checking**: `pnpm type-check` (TypeScript compiler check)
- **Format code**: `pnpm prettier`
- **Astro type checking**: `pnpm astro-check`
- **Generate database migration**: `pnpm drizzle:migration:generate`
- **Create standard.site publication** (one-time setup): `pnpm standard-site:create-publication`
- **Publish a static HTML page to standard.site**: `pnpm standard-site:publish-page <file.html>`

## Architecture Overview

This is a personal website built with **Astro** as the main framework, using **Preact** for interactive components and **Tailwind CSS** for styling. The site is deployed on **Netlify**.

### Key Technologies

- **Astro 5.x**: Static site generator with islands architecture
- **Preact**: React alternative for interactive components (configured with React compatibility via @preact/compat)
- **Tailwind CSS**: Utility-first CSS framework with DaisyUI components
- **TypeScript**: Full TypeScript support throughout
- **Drizzle ORM**: Database ORM for SQLite (LibSQL)
- **MDX**: Enhanced markdown with component support

### Project Structure

- `src/pages/`: Astro pages and API routes
- `src/components/`: Reusable UI components
- `src/layouts/`: Page layout templates
- `src/content/`: Content collections (blog posts, talks, resume experiences)
- `src/lib/`: Utility libraries and integrations (Last.fm, Goodreads, Bluesky, etc.)
- `src/lib/database/`: Database schema and migrations
- `src/styles/`: Global styles and theme configuration

### Content Management

- Uses Astro Content Collections for type-safe content management
- Blog posts, talks, and resume experiences are stored as Markdown/MDX files in `src/content/`
- Dynamic data integrations with Last.fm, Goodreads, and other APIs

### Database

- Uses LibSQL (SQLite compatible) with Drizzle ORM
- Database schema defined in `src/lib/database/schema.ts`
- Migrations managed via `drizzle-kit`

### Sitemap

- Custom dynamic sitemap generated at `src/pages/sitemap.xml.ts` (not using `@astrojs/sitemap`)
- Includes `.astro` pages, `.html` pages, blog posts, and talks
- Last modified dates are derived from git commit history via `src/lib/lastModified.ts`

### standard.site (ATProto) Publishing

- Publishes content to ATProto via [`@bryanguffey/astro-standard-site`](https://github.com/musicjunkieg/astro-standard-site) using the [standard.site](https://standard.site/) spec
- Core logic in `src/lib/standardSite.ts`; publishing is triggered inside the prerendered page renders (`src/pages/blog/[...slug].astro`, `src/pages/blog/links/[slug].astro`, `src/pages/feelings.astro`), guarded by `import.meta.env.PROD` and best-effort/non-fatal
- Blog + Notion link posts publish as `site.standard.document` records and (for recent posts) get a Bluesky announcement so replies render as comments via `src/components/Post/Comments.astro` alongside utteranc.es; feelings mirror the `/feelings.rss` feed
- Published docs are tracked in the `standard_site_documents` table (Drizzle) and deduped via a content hash
- Verification endpoint at `src/pages/.well-known/site.standard.publication.ts`; per-document `<link>` tags emitted in post heads
- Credentials read via static `import.meta.env.*` literals (Astro) with `process.env.*` fallback (vite-node scripts): `BLUESKY_USERNAME`, `BLUESKY_PASSWORD`, `STANDARD_SITE_DID`, `STANDARD_SITE_PUBLICATION_RKEY`

### Deployment

- Configured for Netlify deployment with `@astrojs/netlify` adapter
- All pushes to main branch trigger automatic builds
- Uses Netlify Functions for serverless API endpoints

## Package Manager

Uses **pnpm** (version 9.15.3) as specified in `packageManager` field.
