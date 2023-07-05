import dateFns from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'
import { z } from 'zod'
import { parse as csvParse } from 'csv-parse'
import {
  sql,
  eq,
  and,
  or,
  isNotNull,
  notLike,
  desc,
  gte,
  isNull,
} from 'drizzle-orm'
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
    }, z.array(z.enum(ActivityNames).or(z.enum(PrivateActivityNames)))),
    note_title: z.string().optional(),
    note: z.preprocess((val): string[] => {
      if (!val || typeof val !== 'string') {
        return []
      }

      return val
        .split('- ')
        .filter((line) => !!line)
        .map((line) => line.trim()) as string[]
    }, z.array(z.string().optional())),
  })
  .transform((data) => {
    const time = zonedTimeToUtc(
      `${data.full_date}T${data.time}:00`,
      'America/New_York'
    )

    return {
      time,
      note: data.note as string[],
      ...omit(data, ['full_date', 'time', 'weekday', 'date', 'note']),
    }
  })

const processCSV = async (buffer: Buffer) => {
  const parser = csvParse(buffer, {
    columns: [
      'full_date',
      'date',
      'weekday',
      'time',
      'mood',
      'activities',
      'node_title',
      'note',
    ],
  })
  const entries: ReturnType<(typeof csvSchema)['parse']>[] = []
  const activities = new Set<
    (typeof ActivityNames | typeof PrivateActivityNames)[number]
  >()
  let idx = 0

  for await (const row of parser) {
    idx++

    if (idx === 1) {
      continue
    }

    const entry = csvSchema.parse(row)

    entries.push(entry)
    entry.activities.forEach((activity) => {
      activities.add(activity)
    })
  }

  await db.transaction(async (tx) => {
    await tx
      .insert(daylioActivities)
      .values(
        Array.from(activities.values()).map((activity) => ({
          activity,
        }))
      )
      .onConflictDoNothing()
      .run()

    await Promise.all(
      entries.map((entry) =>
        tx
          .insert(daylioEntries)
          .values({
            time: entry.time,
            mood: entry.mood,
            notes: entry.note,
          })
          .onConflictDoUpdate({
            target: daylioEntries.time,
            set: {
              mood: entry.mood,
              notes: entry.note,
              updatedAt: timestampSQL,
            },
          })
          .run()
      )
    )

    const entryActivities = entries.flatMap((entry) =>
      entry.activities.map((activity) => ({
        time: entry.time,
        activity,
      }))
    )

    await tx
      .insert(daylioEntryActivities)
      .values(entryActivities)
      .onConflictDoNothing()
      .run()
  })

  return entries
}

const apiSchema = z
  .object({
    time: z.date(),
    mood: z.enum(MoodNames),
    activities: z.array(z.enum(ActivityNames)),
    notes: z.array(z.string()).or(z.null()),
  })
  .transform((data) => {
    return {
      ...data,
      slug: formatStubbornDateToISO601(data.time),
      emoji: MoodMapping[data.mood],
      activityEmojis: data.activities.map(
        (activity) => ActivityMapping[activity]
      ),
    }
  })

const getAll = async ({
  start,
  limit,
  unpublished,
}: {
  start?: Date
  limit?: number
  unpublished?: boolean
} = {}) => {
  let query = db
    .select({
      time: daylioEntries.time,
      mood: daylioEntries.mood,
      activities:
        sql`json_group_array(distinct "daylio_activities"."activity")`.mapWith(
          (v) => JSON.parse(v).filter(Boolean)
        ),
      notes: sql`json_group_array(distinct "notes"."value")`.mapWith((v) =>
        JSON.parse(v).filter(Boolean)
      ),
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
    .leftJoin(
      sql`json_each(${daylioEntries.notes}) as notes`,
      and(
        // @ts-ignore
        notLike(sql`"notes"."value"`, '%#private%'),
        isNotNull(sql`"notes"."value"`)
      )
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
    query = query.limit(limit)
  }

  const entries = await query.all()

  return entries.map((entry) => apiSchema.parse(entry))
}

const getLatest = async () => getAll({ limit: 1 }).then((entries) => entries[0])

const getRange = async (start: Date) => getAll({ start })

const getChartData = async (timeWindow: Date): Promise<DaylioChartEntry[]> =>
  getAll().then((feelings) =>
    feelings
      .filter((entry) => dateFns.isAfter(entry.time, timeWindow))
      .sort((a, b) => dateFns.compareAsc(a.time, b.time))
      .map(({ time, mood }) => ({
        x: time.toISOString(),
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

const tweetPrefix = (entry: DaylioEntry, now: Date = new Date()) => {
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
  getLatest,
  getRange,
  getChartData,
  processCSV,
  tweetPrefix,
}

export default api
