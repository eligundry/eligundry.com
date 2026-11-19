import { formatInTimeZone } from 'date-fns-tz'
import type { CollagePeriod } from './lastfmCollage'

/**
 * Cloudflare cron triggers run in UTC, and their day-of-week field counts
 * from Sunday = 1 (so `5` is Thursday, not Friday as in standard cron). To
 * keep the jobs on New York wall-clock time across daylight saving, the crons
 * in wrangler.jsonc fire at both possible UTC hours and this picks the jobs
 * that are due at the New York time the trigger was scheduled for.
 */

export const TIME_ZONE = 'America/New_York'

/** Hour (New York time) the Last.fm collages post at. */
export const COLLAGE_HOUR = 12

/** Hour (New York time) the nightly rebuild check runs at. */
export const NIGHTLY_HOUR = 23

export type CronJob =
  | { kind: 'collage'; period: CollagePeriod }
  | { kind: 'nightly' }

export function jobsDueAt(scheduledTime: number | Date): CronJob[] {
  // ISO day of week (1 = Monday … 5 = Friday), day of month, month, hour
  const [weekday, day, month, hour] = formatInTimeZone(
    scheduledTime,
    TIME_ZONE,
    'i d M H'
  )
    .split(' ')
    .map(Number)
  const jobs: CronJob[] = []

  if (hour === COLLAGE_HOUR) {
    if (weekday === 5) {
      jobs.push({ kind: 'collage', period: '7day' })
    }

    if (day === 1) {
      jobs.push({ kind: 'collage', period: '1month' })
    }

    if (day === 1 && month === 1) {
      jobs.push({ kind: 'collage', period: '12month' })
    }
  }

  if (hour === NIGHTLY_HOUR) {
    jobs.push({ kind: 'nightly' })
  }

  return jobs
}
