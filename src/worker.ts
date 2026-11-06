import handler from '@astrojs/cloudflare/entrypoints/server'
import type {
  ExecutionContext,
  ScheduledController,
} from '@cloudflare/workers-types'
import daylio from './lib/daylio'
import { postCollage, type CollagePeriod } from './lib/lastfmCollage'
import { triggerSiteDeploy } from './lib/rebuild'

/**
 * The Worker: Astro serves requests, and the cron triggers in wrangler.jsonc
 * post the Last.fm collages and keep the feelings page fresh.
 */

const collages: Record<string, CollagePeriod> = {
  // Every Friday at 12pm eastern (give or take an hour for DST)
  '0 17 * * 5': '7day',
  // First day of the month
  '0 17 1 * *': '1month',
  // New Year's Day
  '0 17 1 1 *': '12month',
}

// Every night at 11pm eastern
const NIGHTLY_REBUILD = '0 4 * * *'

/**
 * Rebuilds the site when the newest Daylio entry is more than four hours old,
 * so the feelings page's relative dates ("Yesterday, I felt…") stay correct
 * on days without an upload, which already triggers a build.
 */
async function nightlyRebuild() {
  const latest = await daylio.getLatestTime()

  if (!latest) {
    console.log('No Daylio entries found, skipping nightly rebuild')
    return
  }

  if (latest.getTime() >= Date.now() - 4 * 60 * 60 * 1000) {
    console.log(
      `Latest Daylio entry is recent (${latest.toISOString()}), skipping nightly rebuild`
    )
    return
  }

  const triggered = await triggerSiteDeploy(
    'Nightly rebuild cron (stale Daylio entries)'
  )
  console.log(
    triggered
      ? 'Nightly rebuild triggered'
      : 'GITHUB_DEPLOY_TOKEN is not set, skipping nightly rebuild'
  )
}

export default {
  fetch: handler.fetch,
  async scheduled(
    controller: ScheduledController,
    _env: unknown,
    ctx: ExecutionContext
  ) {
    const period = collages[controller.cron]

    if (period) {
      ctx.waitUntil(
        postCollage(period).then((result) =>
          console.log(`Last.fm ${period} collage`, JSON.stringify(result))
        )
      )
    } else if (controller.cron === NIGHTLY_REBUILD) {
      ctx.waitUntil(nightlyRebuild())
    } else {
      console.warn(`No job for cron ${controller.cron}`)
    }
  },
}
