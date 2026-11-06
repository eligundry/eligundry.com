# Goodreads reviews

Goodreads retired its shelf RSS feeds in October 2026, so the homepage reads
books from the public shelf widget (`src/content/goodreads.ts`). Because
Goodreads keeps taking public data away, every book the site sees is also saved
to the `goodreads_reviews` table, keyed by Goodreads' book ID.

## Where the data comes from

- **Each build**: the Goodreads content loader upserts the books from the
  `currently-reading` and `read` widgets: title, author, cover, shelf, rating,
  review ID, and the rating date when the updates widget has it. It never
  overwrites fields only the export has. A failed write fails the build.
- **A Goodreads export**: `pnpm goodreads:import <export.csv>` backfills every
  shelf from My Books > Import and export > Export library. It's the only source
  of the review text (HTML, as Goodreads exports it), spoiler flag, read and
  added dates, ISBN13, page count, and publication year. It keeps the cover,
  review ID, and rating date that only the widgets know, and is safe to re-run.
  "Private Notes" are never saved. Don't commit the export.

Both writes are `INSERT … ON CONFLICT DO UPDATE` sent with `db.batch`, so they
work on Turso and on D1, which has no interactive transactions.

The merge logic is tested against an in-memory SQLite database built from the
migration in `src/lib/goodreads.db.test.ts`.
