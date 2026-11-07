import { sql } from 'drizzle-orm'
import {
  sqliteTable,
  integer,
  text,
  primaryKey,
  index,
} from 'drizzle-orm/sqlite-core'
import { MoodNames } from '../enums'

export const timestampSQL = sql`(cast(strftime('%s', 'now') as int))`

export const daylioEntries = sqliteTable('daylio_entries', {
  time: integer('time', { mode: 'timestamp' }).primaryKey(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(timestampSQL),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(timestampSQL),
  publishedAt: integer('publishedAt', { mode: 'timestamp' }),
  mood: text('mood', { enum: MoodNames }).notNull(),
  notes: text('notes'),
  // The time an older import stored this entry at. Those imports ran in UTC
  // and shifted every entry early by twice New York's UTC offset. Links to
  // /feelings/#<slug> built from the old time are already out in the world
  // (Bluesky posts), so the entry keeps an anchor for it.
  legacyTime: integer('legacyTime', { mode: 'timestamp' }),
})

export const daylioActivities = sqliteTable('daylio_activities', {
  activity: text('activity').primaryKey(),
  private: integer('private').default(0),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(timestampSQL),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(timestampSQL),
})

export const daylioEntryActivities = sqliteTable(
  'daylio_entry_activities',
  {
    time: integer('time', { mode: 'timestamp' })
      .references(() => daylioEntries.time, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
    activity: text('activity')
      .references(() => daylioActivities.activity, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
    createdAt: integer('createdAt', { mode: 'timestamp' }).default(
      timestampSQL
    ),
    updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(
      timestampSQL
    ),
  },
  (table) => [
    primaryKey({ columns: [table.time, table.activity] }),
    // The primary key's index leads with activity, so it can't serve the
    // feelings queries, which join entries to their activities on time.
    // Without this, SQLite builds a temporary index over the whole table on
    // every query.
    index('daylio_entry_activities_time_idx').on(table.time, table.activity),
  ]
)

// Tracks content that has been published to ATProto via standard.site so we
// don't re-publish unchanged documents on every build. Keyed by a stable path
// (e.g. /blog/<slug>/, /blog/links/<slug>/, /feelings#<slug>, /horses).
export const standardSiteDocuments = sqliteTable('standard_site_documents', {
  path: text('path').primaryKey(),
  kind: text('kind', { enum: ['blog', 'link', 'feeling', 'page'] }).notNull(),
  documentUri: text('documentUri').notNull(),
  documentRkey: text('documentRkey').notNull(),
  documentCid: text('documentCid').notNull(),
  // The Bluesky announcement post that comments are threaded under (blog/link
  // posts only). Null for content we don't announce (e.g. feelings).
  bskyPostUri: text('bskyPostUri'),
  bskyPostCid: text('bskyPostCid'),
  // sha256 of title + body; when it changes we update the ATProto record.
  contentHash: text('contentHash').notNull(),
  publishedAt: integer('publishedAt', { mode: 'timestamp' }).default(
    timestampSQL
  ),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(timestampSQL),
})

// Every book on Eli's Goodreads shelves, keyed by Goodreads' book ID. Each build
// upserts what the public shelf widget shows, and `pnpm goodreads:import`
// backfills from a Goodreads CSV export, which is the only source of the review
// text and reading dates. Dates are YYYY-MM-DD text.
export const goodreadsReviews = sqliteTable('goodreads_reviews', {
  bookId: text('bookId').primaryKey(),
  // The ID in the review's URL, https://www.goodreads.com/review/show/<id>
  reviewId: text('reviewId'),
  title: text('title').notNull(),
  author: text('author').notNull(),
  cover: text('cover'),
  // Goodreads' exclusive shelf: read, currently-reading, to-read, ...
  shelf: text('shelf').notNull(),
  // 1-5 stars, or 0 when unrated
  rating: integer('rating').notNull().default(0),
  // The review as Goodreads exports it, which is HTML
  review: text('review'),
  spoiler: integer('spoiler', { mode: 'boolean' }).notNull().default(false),
  dateRead: text('dateRead'),
  dateAdded: text('dateAdded'),
  ratedAt: text('ratedAt'),
  isbn13: text('isbn13'),
  pages: integer('pages'),
  yearPublished: integer('yearPublished'),
  // When a Goodreads export last wrote this row. The export is more complete
  // and accurate than the widgets, so builds don't overwrite its fields.
  importedAt: integer('importedAt', { mode: 'timestamp' }),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(timestampSQL),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(timestampSQL),
})
