import type { Handler } from '@netlify/functions'

export const handler: Handler = async () => {
  console.log(
    'Checking if nightly rebuild is needed based on latest Daylio entry'
  )

  if (!process.env.NETLIFY_BUILD_HOOK) {
    console.log('NETLIFY_BUILD_HOOK is not set, skipping nightly rebuild')
    return {
      statusCode: 200,
    }
  }

  try {
    const resp = await fetch(`${process.env.URL}/api/daylio`)

    if (!resp.ok) {
      const text = await resp.text()
      throw new Error(
        `Failed to fetch /api/daylio: ${resp.status} ${text}`
      )
    }

    const entries: { time: string }[] = await resp.json()
    const latest = entries
      .map((entry) => new Date(entry.time).getTime())
      .reduce((acc, time) => (time > acc ? time : acc), 0)

    if (!latest) {
      console.log('No Daylio entries found, skipping nightly rebuild')
      return {
        statusCode: 200,
      }
    }

    const fourHoursAgo = Date.now() - 4 * 60 * 60 * 1000

    if (latest >= fourHoursAgo) {
      console.log(
        `Latest Daylio entry is recent (${new Date(latest).toISOString()}), skipping nightly rebuild`
      )
      return {
        statusCode: 200,
      }
    }

    console.log(
      `Latest Daylio entry is stale (${new Date(latest).toISOString()}), triggering nightly rebuild`
    )

    const buildResp = await fetch(process.env.NETLIFY_BUILD_HOOK, {
      method: 'POST',
    })

    if (!buildResp.ok) {
      const text = await buildResp.text()
      throw new Error(
        `Failed to trigger Netlify build hook: ${buildResp.status} ${text}`
      )
    }

    console.log('Nightly rebuild triggered successfully')

    return {
      statusCode: 200,
    }
  } catch (error) {
    console.error('Failed to run nightly rebuild check', error)
    return {
      statusCode: 500,
    }
  }
}
