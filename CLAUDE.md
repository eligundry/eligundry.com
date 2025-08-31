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

### Deployment
- Configured for Netlify deployment with `@astrojs/netlify` adapter
- All pushes to main branch trigger automatic builds
- Uses Netlify Functions for serverless API endpoints

## Package Manager
Uses **pnpm** (version 9.15.3) as specified in `packageManager` field.