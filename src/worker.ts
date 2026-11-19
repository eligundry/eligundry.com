import handler from '@astrojs/cloudflare/entrypoints/server'
import type {
  ExecutionContext,
  ScheduledController,
} from '@cloudflare/workers-types'
import daylio from './lib/daylio'
import { jobsDueAt } from './lib/cronJobs'
import { postCollage } from './lib/lastfmCollage'
import { triggerSiteDeploy } from './lib/rebuild'

/**
 * The Worker: Astro serves requests, and the cron triggers in wrangler.jsonc
 * post the Last.fm collages and keep the feelings page fresh. Which job runs
 * is decided by New York time in ./lib/cronJobs.
 */

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
      : 'DEPLOY_HOOK_URL is not set, skipping nightly rebuild'
  )
}

export default {
  fetch: handler.fetch,
  async scheduled(
    controller: ScheduledController,
    _env: unknown,
    ctx: ExecutionContext
  ) {
    const jobs = jobsDueAt(controller.scheduledTime)

    if (jobs.length === 0) {
      console.log(
        `Cron ${controller.cron} has nothing due at ${new Date(controller.scheduledTime).toISOString()}`
      )
    }

    for (const job of jobs) {
      if (job.kind === 'collage') {
        ctx.waitUntil(
          postCollage(job.period).then((result) =>
            console.log(`Last.fm ${job.period} collage`, JSON.stringify(result))
          )
        )
      } else {
        ctx.waitUntil(nightlyRebuild())
      }
    }
  },
}
