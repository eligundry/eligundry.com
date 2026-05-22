import { JSDOM } from 'jsdom'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import * as crypto from 'node:crypto'

const FETCH_TIMEOUT_MS = 10000
const HASH_LENGTH = 8
// `.cache/og-cache` holds parsed OG metadata so we don't re-fetch + re-parse
// HTML on every build. Netlify's plugin-cache restores the `.cache` path
// between builds. The image itself is served by Astro's image pipeline,
// driven by `getImage({ src: ogData.imageUrl })` in the LinkEmbed.
const METADATA_CACHE_DIR = path.join(process.cwd(), '.cache', 'og-cache')

export interface OpenGraphData {
  title: string | null
  description: string | null
  imageUrl: string | null
  siteName: string | null
  url: string
}

function hash(input: string): string {
  return crypto
    .createHash('md5')
    .update(input)
    .digest('hex')
    .slice(0, HASH_LENGTH)
}

function getMetaContent(doc: Document, selectors: string[]): string | null {
  for (const selector of selectors) {
    const el = doc.querySelector(selector)
    if (el) {
      return el.getAttribute('content') ?? el.getAttribute('value') ?? null
    }
  }
  return null
}

async function readCachedMetadata(
  filePath: string
): Promise<OpenGraphData | null> {
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    return JSON.parse(raw) as OpenGraphData
  } catch {
    return null
  }
}

async function writeCachedMetadata(
  filePath: string,
  data: OpenGraphData
): Promise<void> {
  try {
    await fs.mkdir(METADATA_CACHE_DIR, { recursive: true })
    await fs.writeFile(filePath, JSON.stringify(data))
  } catch {
    // caching is best-effort
  }
}

export async function fetchOpenGraphData(url: string): Promise<OpenGraphData> {
  const metadataPath = path.join(METADATA_CACHE_DIR, `${hash(url)}.json`)
  const cached = await readCachedMetadata(metadataPath)
  if (cached) return cached

  const empty: OpenGraphData = {
    title: null,
    description: null,
    imageUrl: null,
    siteName: null,
    url,
  }

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; eligundry.com bot; +https://eligundry.com)',
      },
    })

    if (!response.ok) return empty

    const html = await response.text()
    const dom = new JSDOM(html)
    const doc = dom.window.document

    const title =
      getMetaContent(doc, [
        'meta[property="og:title"]',
        'meta[name="twitter:title"]',
      ]) ??
      doc.querySelector('title')?.textContent ??
      null

    const description = getMetaContent(doc, [
      'meta[property="og:description"]',
      'meta[name="description"]',
      'meta[name="twitter:description"]',
    ])

    const rawImageUrl = getMetaContent(doc, [
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
      'meta[name="twitter:image:src"]',
    ])
    const imageUrl = rawImageUrl
      ? rawImageUrl.startsWith('http')
        ? rawImageUrl
        : new URL(rawImageUrl, url).href
      : null

    const siteName = getMetaContent(doc, ['meta[property="og:site_name"]'])

    const data: OpenGraphData = {
      title,
      description,
      imageUrl,
      siteName,
      url,
    }
    await writeCachedMetadata(metadataPath, data)
    return data
  } catch {
    return empty
  }
}

export function getYouTubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (
      parsed.hostname === 'www.youtube.com' ||
      parsed.hostname === 'youtube.com'
    ) {
      return parsed.searchParams.get('v')
    }
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1)
    }
  } catch {
    // invalid URL
  }
  return null
}
