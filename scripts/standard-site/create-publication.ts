/**
 * One-time (re-runnable) setup: publishes the `site.standard.publication`
 * record to ATProto and prints the resulting DID + rkey, which go in the
 * Workers Builds build variables so production builds can publish
 * documents and serve the verification endpoint.
 *
 * Run with:  pnpm standard-site:create-publication
 * Requires BLUESKY_USERNAME and BLUESKY_PASSWORD in the environment.
 */
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

  console.log(
    '\nDone. Save both as Workers Builds build variables (Settings > Builds on the Worker), then redeploy so the .well-known endpoint and document publishing pick them up.'
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
