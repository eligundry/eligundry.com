import dateFns from 'date-fns'
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz'
import { z } from 'zod'
import { parse as csvParse } from 'csv-parse'
import { sql, eq, and, or, isNotNull, notLike, desc, gte } from 'drizzle-orm'
import omit from 'lodash/omit'
import { MoodMapping, ActivityMapping } from './enums'
import {
  db,
  daylioEntries,
  daylioActivities,
  daylioEntryActivities,
  timestampSQL,
} from './database'

const csvSchema = z
  .object({
    full_date: z.string(),
    date: z.string(),
    weekday: z.string(),
    time: z.string(),
    mood: z.enum(['rad', 'good', 'meh', 'bad', 'awful']),
    activities: z.preprocess(
      (s) => (typeof s === 'string' ? s.split(' | ') : []),
      z.array(z.string())
    ),
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
  const activities = new Set<string>()
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

const getAll = async ({
  start,
  limit,
}: { start?: Date; limit?: number } = {}) => {
  let query = db
    .select({
      time: daylioEntries.time,
      mood: daylioEntries.mood,
      activities:
        sql`json_group_array(distinct daylio_activities.activity)`.mapWith(
          (v) => JSON.parse(v).filter(Boolean)
        ),
      notes: sql`json_group_array(distinct notes.value)`.mapWith((v) =>
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
        or(
          eq(daylioActivities.private, 0),
          isNotNull(daylioActivities.activity)
        ),
        start ? gte(daylioEntries.time, start) : undefined
      )
    )
    .groupBy(daylioEntries.time)
    .orderBy(desc(daylioEntries.time))

  if (limit) {
    query = query.limit(limit)
  }

  const entries = await query.all()
  console.log(entries[0].time.getTimezoneOffset())

  return entries.map((entry) => ({
    ...entry,
    emoji: MoodMapping[entry.mood],
    time: utcToZonedTime(entry.time, 'America/New_York'),
  }))
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

export interface RawDaylioEntry<TimeType = Date> {
  time: TimeType
  mood: keyof typeof MoodMapping
  activities: (keyof typeof ActivityMapping)[]
  notes: string[] | null
}

export interface DaylioEntry extends RawDaylioEntry<Date> {
  rawTime: string
  emoji: MoodMapping
}

export interface DaylioChartEntry {
  x: string
  y: number
}

const api = { getAll, getLatest, getRange, getChartData, processCSV }

export default api
