import { JSDOM } from 'jsdom'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import * as crypto from 'node:crypto'

const FETCH_TIMEOUT_MS = 10000
const HASH_LENGTH = 8
const CACHE_DIR = path.join(process.cwd(), 'public', 'og-cache')

export interface OpenGraphData {
  title: string | null
  description: string | null
  imageUrl: string | null
  cachedImagePath: string | null
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

async function cacheImage(imageUrl: string): Promise<string | null> {
  try {
    const ext = imageUrl.split('?')[0].split('.').pop()?.toLowerCase() ?? 'jpg'
    const safeExt = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'].includes(ext)
      ? ext
      : 'jpg'
    const filename = `${hash(imageUrl)}.${safeExt}`
    const filePath = path.join(CACHE_DIR, filename)
    const publicPath = `/og-cache/${filename}`

    try {
      await fs.access(filePath)
      return publicPath
    } catch {
      // File doesn't exist, download it
    }

    await fs.mkdir(CACHE_DIR, { recursive: true })

    const response = await fetch(imageUrl, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })
    if (!response.ok) return null

    const buffer = await response.arrayBuffer()
    await fs.writeFile(filePath, new Uint8Array(buffer))
    return publicPath
  } catch {
    return null
  }
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
    await fs.mkdir(CACHE_DIR, { recursive: true })
    await fs.writeFile(filePath, JSON.stringify(data))
  } catch {
    // swallow — caching is best-effort
  }
}

export async function fetchOpenGraphData(url: string): Promise<OpenGraphData> {
  const metadataPath = path.join(CACHE_DIR, `${hash(url)}.json`)
  const cached = await readCachedMetadata(metadataPath)
  if (cached) return cached

  const empty: OpenGraphData = {
    title: null,
    description: null,
    imageUrl: null,
    cachedImagePath: null,
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

    if (!response.ok) {
      return empty
    }

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

    const imageUrl = getMetaContent(doc, [
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
      'meta[name="twitter:image:src"]',
    ])

    const siteName = getMetaContent(doc, ['meta[property="og:site_name"]'])

    let cachedImagePath: string | null = null
    if (imageUrl) {
      const absoluteImageUrl = imageUrl.startsWith('http')
        ? imageUrl
        : new URL(imageUrl, url).href
      cachedImagePath = await cacheImage(absoluteImageUrl)
    }

    const data: OpenGraphData = {
      title,
      description,
      imageUrl,
      cachedImagePath,
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
