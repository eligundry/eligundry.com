import { sql } from 'drizzle-orm'
import {
  sqliteTable,
  integer,
  text,
  blob,
  primaryKey,
} from 'drizzle-orm/sqlite-core'
import { MoodNames, ActivityNames, PrivateActivityNames } from '../enums'

export const timestampSQL = sql`(cast(strftime('%s', 'now') as int))`

export const daylioEntries = sqliteTable('daylio_entries', {
  time: integer('time', { mode: 'timestamp' }).primaryKey(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(timestampSQL),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(timestampSQL),
  publishedAt: integer('publishedAt', { mode: 'timestamp' }),
  mood: text('mood', { enum: MoodNames }).notNull(),
  notes: blob('notes', {
    mode: 'json',
  }).$type<string[]>(),
})

export const daylioActivities = sqliteTable('daylio_activities', {
  activity: text('activity', {
    enum: [...ActivityNames, ...PrivateActivityNames],
  }).primaryKey(),
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
  (table) => ({
    pk: primaryKey(table.time, table.activity),
  })
)
