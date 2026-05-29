import { sql } from 'drizzle-orm'
import { sqliteTable, integer, text, primaryKey } from 'drizzle-orm/sqlite-core'
import { MoodNames } from '../enums'

export const timestampSQL = sql`(cast(strftime('%s', 'now') as int))`

export const daylioEntries = sqliteTable('daylio_entries', {
  time: integer('time', { mode: 'timestamp' }).primaryKey(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(timestampSQL),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(timestampSQL),
  publishedAt: integer('publishedAt', { mode: 'timestamp' }),
  mood: text('mood', { enum: MoodNames }).notNull(),
  notes: text('notes'),
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
  (table) => [primaryKey({ columns: [table.time, table.activity] })]
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
