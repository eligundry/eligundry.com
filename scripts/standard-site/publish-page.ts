/**
 * Manually publish hand-made static HTML pages (e.g. src/pages/horses.html) to
 * standard.site as ATProto documents.
 *
 * Run with:  pnpm standard-site:publish-page src/pages/horses.html [more.html ...]
 * Requires BLUESKY_USERNAME, BLUESKY_PASSWORD, and STANDARD_SITE_DID.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { JSDOM } from 'jsdom'
import { isConfigured, publishStaticPage } from '../../src/lib/standardSite'

/** Map a file like src/pages/saturdays/index.html to the route /saturdays/. */
function fileToRoutePath(file: string): string {
  let rel = file.replace(/\\/g, '/').replace(/^.*?src\/pages\//, '')
  rel = rel.replace(/\.html$/, '').replace(/(^|\/)index$/, '$1')
  if (!rel.startsWith('/')) rel = `/${rel}`
  return rel
}

async function publishFile(file: string) {
  const html = readFileSync(file, 'utf-8')
  const doc = new JSDOM(html).window.document

  const title =
    doc.querySelector('title')?.textContent?.trim() ||
    doc.querySelector('h1')?.textContent?.trim() ||
    path.basename(file)
  const description =
    doc
      .querySelector('meta[name="description"]')
      ?.getAttribute('content')
      ?.trim() || undefined

  doc.querySelectorAll('script, style, noscript').forEach((el) => el.remove())
  const textContent = (doc.body?.textContent ?? '').replace(/\s+/g, ' ').trim()

  const routePath = fileToRoutePath(file)
  const row = await publishStaticPage({
    path: routePath,
    title,
    description,
    body: textContent,
  })

  console.log(`✓ ${file} → ${routePath}`)
  if (row) console.log(`   ${row.documentUri}`)
}

async function main() {
  const files = process.argv.slice(2)

  if (files.length === 0) {
    console.error(
      'Usage: pnpm standard-site:publish-page <file.html> [<file.html> ...]'
    )
    process.exit(1)
  }

  if (!isConfigured()) {
    console.error(
      'standard.site is not configured. Set BLUESKY_USERNAME, BLUESKY_PASSWORD, and STANDARD_SITE_DID.'
    )
    process.exit(1)
  }

  for (const file of files) {
    try {
      await publishFile(file)
    } catch (e) {
      console.error(`✗ Failed to publish ${file}:`, e)
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
