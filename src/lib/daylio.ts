import * as dateFns from 'date-fns'
import { formatInTimeZone, fromZonedTime, getTimezoneOffset } from 'date-fns-tz'
import { z } from 'zod'
import { parse as csvParse } from 'csv-parse'
import { sql, eq, and, or, desc, gte, isNull } from 'drizzle-orm'
import chunk from 'lodash/chunk'
import omit from 'lodash/omit'
import {
  MoodMapping,
  MoodNames,
  ActivityMapping,
  ActivityNames,
  PrivateActivityNames,
} from './enums'
import {
  db,
  daylioEntries,
  daylioActivities,
  daylioEntryActivities,
  timestampSQL,
} from './database'
import { formatStubbornDateToISO601 } from './utils'
import { stripPrivateLines } from './daylioNotes/stripPrivateLines'

type KnownActivity =
  | (typeof ActivityNames)[number]
  | (typeof PrivateActivityNames)[number]
// `string & {}` preserves autocomplete for known activity names while still
// accepting new ones that Daylio introduces.
type Activity = KnownActivity | (string & {})
const activitySchema = z
  .union([z.enum(ActivityNames), z.enum(PrivateActivityNames), z.string()])
  .transform((val) => val as Activity)

const csvSchema = z
  .object({
    full_date: z.string(),
    date: z.string(),
    weekday: z.string(),
    time: z.string(),
    mood: z.enum(MoodNames),
    activities: z.preprocess((s) => {
      if (typeof s !== 'string') {
        return []
      }

      const activities = s.split(' | ').map((str) => str.trim())

      if (activities.length === 1 && activities[0] === '') {
        return []
      }

      return activities
    }, z.array(activitySchema)),
    scales: z.string().optional(),
    note_title: z.string().optional(),
    note: z.preprocess((val) => {
      if (!val || typeof val !== 'string') {
        return null
      }

      // Daylio CSV doesn't include newlines. List items are delimited
      // by '- ' and paragraphs are delimited by double spaces.
      if (val.startsWith('- ')) {
        const lines = val
          .split('- ')
          .filter((line) => !!line)
          .map((line) => line.trim())
        return lines.map((line) => `- ${line}`).join('\n')
      }

      return val.replace(/  +/g, '\n\n')
    }, z.string().nullable()),
  })
  .transform((data) => {
    // The export's times are wall-clock times in New York. fromZonedTime reads
    // them that way whatever the machine's time zone (a Worker runs in UTC).
    const time = fromZonedTime(
      `${data.full_date}T${data.time}:00`,
      'America/New_York'
    )

    return {
      time,
      note: data.note,
      ...omit(data, ['full_date', 'time', 'weekday', 'date', 'note', 'scales']),
    }
  })

/**
 * Where the original importer put an entry. It ran on Netlify in UTC and read
 * the export's New York wall-clock time as UTC, then shifted it by New York's
 * offset, landing 8 or 10 hours early. Links to /feelings/#<slug> built from
 * that time are already out in the world (Bluesky posts, standard.site), so
 * each entry keeps an anchor for it.
 */
export const legacyTime = (time: Date): Date => {
  const wallClock = formatInTimeZone(
    time,
    'America/New_York',
    "yyyy-MM-dd'T'HH:mm:ss"
  )
  const asUTC = new Date(`${wallClock}Z`)
  return new Date(
    asUTC.getTime() + getTimezoneOffset('America/New_York', asUTC)
  )
}

const processCSV = async (buffer: Buffer) => {
  const parser = csvParse(buffer, {
    columns: [
      'full_date',
      'date',
      'weekday',
      'time',
      'mood',
      'activities',
      'scales',
      'note_title',
      'note',
    ],
    from_line: 2,
  })
  const entries: ReturnType<(typeof csvSchema)['parse']>[] = []
  const activities = new Set<Activity>()

  for await (const row of parser) {
    const entry = csvSchema.parse(row)

    entries.push(entry)
    entry.activities.forEach((activity) => {
      activities.add(activity)
    })
  }

  if (entries.length === 0) {
    return entries
  }

  // One batch rather than a transaction: a batch runs atomically on both
  // libSQL and D1, and D1 doesn't support interactive transactions. Rows go
  // in chunks because D1 allows at most 100 bound parameters per statement.
  const statements = [
    ...chunk(Array.from(activities.values()), 90).map((chunk) =>
      db
        .insert(daylioActivities)
        .values(chunk.map((activity) => ({ activity })))
        .onConflictDoNothing()
    ),
    ...chunk(entries, 30).map((chunk) =>
      db
        .insert(daylioEntries)
        .values(
          chunk.map((entry) => ({
            time: entry.time,
            mood: entry.mood,
            notes: entry.note,
          }))
        )
        .onConflictDoUpdate({
          target: daylioEntries.time,
          set: {
            mood: sql`excluded.mood`,
            notes: sql`excluded.notes`,
            updatedAt: timestampSQL,
          },
        })
    ),
    ...chunk(
      entries.flatMap((entry) =>
        entry.activities.map((activity) => ({ time: entry.time, activity }))
      ),
      45
    ).map((chunk) =>
      db.insert(daylioEntryActivities).values(chunk).onConflictDoNothing()
    ),
  ]
  const [first, ...rest] = statements

  if (first) {
    await db.batch([first, ...rest])
  }

  return entries
}

const markAllEntriesAsPublished = async () =>
  db
    .update(daylioEntries)
    .set({
      publishedAt: new Date(),
    })
    .where(isNull(daylioEntries.publishedAt))
    .run()

const apiSchema = z
  .object({
    time: z.date(),
    mood: z.enum(MoodNames),
    activities: z.preprocess(
      (val) =>
        Array.isArray(val)
          ? val.filter((a): a is (typeof ActivityNames)[number] =>
              (ActivityNames as readonly string[]).includes(a)
            )
          : val,
      z.array(z.enum(ActivityNames))
    ),
    note: z.object({ markdown: z.string(), html: z.string() }).or(z.null()),
  })
  .transform((data) => {
    return {
      ...data,
      slug: formatStubbornDateToISO601(data.time),
      legacySlug: formatStubbornDateToISO601(legacyTime(data.time)),
      emoji: MoodMapping[data.mood],
      activityEmojis: data.activities.map(
        (activity) => ActivityMapping[activity]
      ),
      score: Object.keys(MoodMapping).findIndex((m) => m === data.mood),
    }
  })

interface QueryOptions {
  start?: Date
  limit?: number
  unpublished?: boolean
}

const queryEntries = async ({ start, limit, unpublished }: QueryOptions) => {
  let query = db
    .select({
      time: daylioEntries.time,
      mood: daylioEntries.mood,
      activities:
        sql`json_group_array(distinct "daylio_activities"."activity")`.mapWith(
          (v) => JSON.parse(v).filter(Boolean)
        ),
      notes: daylioEntries.notes,
    })
    .from(daylioEntries)
    .leftJoin(
      daylioEntryActivities,
      eq(daylioEntries.time, daylioEntryActivities.time)
    )
    .leftJoin(
      daylioActivities,
      eq(daylioEntryActivities.activity, daylioActivities.activity)
    )
    .where(
      and(
        or(eq(daylioActivities.private, 0), isNull(daylioActivities.activity)),
        start ? gte(daylioEntries.time, start) : undefined,
        unpublished ? isNull(daylioEntries.publishedAt) : undefined
      )
    )
    .groupBy(daylioEntries.time)
    .orderBy(desc(daylioEntries.time))

  if (limit) {
    // @ts-ignore
    query = query.limit(limit)
  }

  return query.all()
}

/**
 * Every public entry with its note rendered to HTML. Rendering loads the
 * Sätteri markdown processor, which only runs at build time on Node, so it's
 * imported here rather than at the top of this module: the Daylio upload
 * route imports this module too, and has to stay free of native bindings.
 */
const getAll = async (options: QueryOptions = {}) => {
  const rows = await queryEntries(options)
  const { renderNote } = await import('./daylioNotes')

  const entries = await Promise.all(
    rows.map(async ({ notes, ...rest }) => ({
      ...rest,
      note: notes ? await renderNote(notes) : null,
    }))
  )

  return z.array(apiSchema).parse(entries)
}

/**
 * Entries that haven't been posted to Bluesky yet, with their notes as raw
 * markdown, for the upload route.
 */
const getUnpublished = async ({ start }: { start?: Date } = {}) => {
  const rows = await queryEntries({ start, unpublished: true })

  return rows.map((row) => ({
    time: row.time,
    mood: row.mood as (typeof MoodNames)[number],
    slug: formatStubbornDateToISO601(row.time),
    markdown: row.notes ? stripPrivateLines(row.notes) : null,
  }))
}

/** When the newest entry was logged, without loading any notes. */
const getLatestTime = async (): Promise<Date | null> => {
  const [row] = await db
    .select({ time: daylioEntries.time })
    .from(daylioEntries)
    .orderBy(desc(daylioEntries.time))
    .limit(1)
    .all()

  return row?.time ?? null
}

const getLatest = async () => getAll({ limit: 1 }).then((entries) => entries[0])

const getRange = async (start: Date) => getAll({ start })

const getChartData = async (timeWindow: Date): Promise<DaylioChartEntry[]> =>
  getAll().then((feelings) =>
    feelings
      .filter((entry) => dateFns.isAfter(entry.time, timeWindow))
      .sort((a, b) => dateFns.compareAsc(a.time, b.time))
      .map(({ slug, mood }) => ({
        x: slug,
        y: Object.keys(MoodMapping).findIndex((m) => m === mood),
      }))
  )

export const colloquialDifferenceInDays = (
  later: Date,
  earlier: Date
): number => {
  const resetLater = dateFns.set(later, {
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const resetEarlier = dateFns.set(earlier, {
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const resetDifference = dateFns.differenceInDays(resetLater, resetEarlier)

  if (resetDifference === 1 && later.getHours() <= 6) {
    return 0
  }

  return resetDifference
}

const tweetPrefix = (
  entry: Pick<DaylioEntry, 'time' | 'mood'>,
  now: Date = new Date()
) => {
  const difference = colloquialDifferenceInDays(now, entry.time)
  let title = `I felt ${entry.mood}`

  if (difference === 0) {
    title = `Today, ${title}`
  } else if (difference === 1) {
    title = `Yesterday, ${title}`
  } else if (difference <= 7) {
    title = `${difference} days ago, ${title}`
  }

  return title
}

export type DaylioEntry = Awaited<ReturnType<typeof getAll>>[0]
export interface DaylioChartEntry {
  x: string
  y: number
}

const api = {
  getAll,
  getUnpublished,
  getLatestTime,
  getLatest,
  getRange,
  getChartData,
  processCSV,
  tweetPrefix,
  markAllEntriesAsPublished,
  schema: apiSchema,
}

export default api
