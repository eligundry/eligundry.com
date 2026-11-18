import { and, asc, desc, gte, lte, sql } from 'drizzle-orm'
import retry from 'async-retry'
import * as dateFns from 'date-fns'
import { db, githubContributions } from './database'

export interface GithubContribution {
  /** YYYY-MM-DD */
  date: string
  count: number
  /** GitHub's 0-4 shade for the day */
  level: number
}

interface GithubApiResponse {
  total: Record<string, number>
  contributions: GithubContribution[]
}

/**
 * A user's contributions from https://github.com/grubersjoe/github-contributions-api,
 * which reads them off their GitHub profile. `last` is the last year up to
 * today, `all` is every year since they joined.
 */
export async function fetchContributions(
  user: string,
  year: 'last' | 'all' | number = 'last'
): Promise<GithubContribution[]> {
  return retry(
    async () => {
      const url = new URL(
        `https://github-contributions-api.jogruber.de/v4/${user}`
      )
      url.searchParams.set('y', year.toString())

      const resp = await fetch(url)

      // fetch doesn't reject on HTTP errors, so throw to trigger a retry
      if (!resp.ok) {
        throw new Error(`${resp.status} ${resp.statusText}`)
      }

      const data: GithubApiResponse = await resp.json()
      return data.contributions
        .map(({ date, count, level }) => ({ date, count, level }))
        .sort((a, b) => a.date.localeCompare(b.date))
    },
    { retries: 3, minTimeout: 500 }
  )
}

// D1 can't run interactive transactions and caps a statement at 100 bound
// parameters, so writes go out with db.batch, a statement per day, in chunks.
const BATCH_SIZE = 50

/**
 * Save days to the database. A day that's already saved keeps the higher
 * count, with the level that came with it, so contributions GitHub stops
 * showing (like private work for a former employer) stay on the calendar.
 */
export async function saveContributions(days: GithubContribution[]) {
  const higher = sql`excluded.\`count\` > ${githubContributions.count}`

  for (let i = 0; i < days.length; i += BATCH_SIZE) {
    const [first, ...rest] = days.slice(i, i + BATCH_SIZE).map((day) =>
      db
        .insert(githubContributions)
        .values(day)
        .onConflictDoUpdate({
          target: githubContributions.date,
          set: {
            count: sql`max(${githubContributions.count}, excluded.\`count\`)`,
            level: sql`case when ${higher} then excluded.\`level\` else ${githubContributions.level} end`,
            updatedAt: sql`case when ${higher} then (cast(strftime('%s', 'now') as int)) else ${githubContributions.updatedAt} end`,
          },
        })
    )
    if (first) await db.batch([first, ...rest])
  }
}

/** Saved days from `from` to `to`, YYYY-MM-DD and inclusive, oldest first. */
export async function loadContributions(
  from: string,
  to: string
): Promise<GithubContribution[]> {
  return db
    .select({
      date: githubContributions.date,
      count: githubContributions.count,
      level: githubContributions.level,
    })
    .from(githubContributions)
    .where(
      and(
        gte(githubContributions.date, from),
        lte(githubContributions.date, to)
      )
    )
    .orderBy(asc(githubContributions.date))
}

/** The latest saved day, YYYY-MM-DD. */
async function lastSavedDate(): Promise<string | undefined> {
  const [row] = await db
    .select({ date: githubContributions.date })
    .from(githubContributions)
    .orderBy(desc(githubContributions.date))
    .limit(1)
  return row?.date
}

const ymd = (date: Date) => dateFns.format(date, 'yyyy-MM-dd')

/** Every day from `from` to `to`, with the days missing from `days` as zeros. */
export function fillDays(
  days: GithubContribution[],
  from: string,
  to: string
): GithubContribution[] {
  const byDate = new Map(days.map((day) => [day.date, day]))
  return dateFns
    .eachDayOfInterval({
      start: dateFns.parseISO(from),
      end: dateFns.parseISO(to),
    })
    .map(ymd)
    .map((date) => byDate.get(date) ?? { date, count: 0, level: 0 })
}

/**
 * The last year of the calendar. Fetches it from GitHub and saves it, then
 * reads it back from the database, which also has whatever GitHub has since
 * forgotten. If GitHub can't be reached, it's the year up to the last saved
 * day. A failed database write fails the build, so nothing goes unsaved.
 */
export async function lastYearOfContributions(
  user: string
): Promise<GithubContribution[]> {
  const fetched = await fetchContributions(user, 'last').catch((e) => {
    console.warn('could not fetch GitHub contributions', e)
    return []
  })

  if (fetched.length > 0) {
    await saveContributions(fetched)
  }

  const to = fetched.at(-1)?.date ?? (await lastSavedDate())
  if (!to) {
    return []
  }

  const from =
    fetched[0]?.date ?? ymd(dateFns.subYears(dateFns.parseISO(to), 1))
  return fillDays(await loadContributions(from, to), from, to)
}
