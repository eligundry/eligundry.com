/**
 * One-time (re-runnable) setup: publishes the `site.standard.publication`
 * record to ATProto and writes the resulting DID + rkey to Netlify so
 * production builds can publish documents and serve the verification endpoint.
 *
 * Run with:  pnpm standard-site:create-publication
 * Requires BLUESKY_USERNAME and BLUESKY_PASSWORD in the environment, and the
 * netlify CLI to be linked (`netlify link`).
 */
import { execFileSync } from 'node:child_process'
import { getPublisher } from '../../src/lib/standardSite'
import config from '../../src/config'

async function main() {
  const username =
    import.meta.env.BLUESKY_USERNAME || process.env.BLUESKY_USERNAME
  const appPassword =
    import.meta.env.BLUESKY_PASSWORD || process.env.BLUESKY_PASSWORD

  if (!username || !appPassword) {
    console.error(
      'Missing credentials: set BLUESKY_USERNAME and BLUESKY_PASSWORD (a Bluesky app password).'
    )
    process.exit(1)
  }

  const publisher = await getPublisher()
  const result = await publisher.publishPublication({
    name: config.title,
    url: config.url,
    description: config.description,
  })

  const did = publisher.getDid()
  const publicationRkey = result.uri.split('/').pop() as string

  console.log('\nPublication record published:')
  console.log('  AT-URI:', result.uri)
  console.log('  STANDARD_SITE_DID:', did)
  console.log('  STANDARD_SITE_PUBLICATION_RKEY:', publicationRkey)

  const vars: Array<[string, string]> = [
    ['STANDARD_SITE_DID', did],
    ['STANDARD_SITE_PUBLICATION_RKEY', publicationRkey],
  ]

  for (const [key, value] of vars) {
    try {
      execFileSync('netlify', ['env:set', key, value], { stdio: 'inherit' })
      console.log(`✓ Set Netlify env ${key}`)
    } catch (e) {
      console.error(
        `✗ Could not set Netlify env ${key} — set it manually. (${
          (e as Error).message
        })`
      )
    }
  }

  console.log(
    '\nDone. Redeploy so the .well-known endpoint and document publishing pick up the new env vars.'
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
