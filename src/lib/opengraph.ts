import { JSDOM } from 'jsdom'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import * as crypto from 'node:crypto'

const FETCH_TIMEOUT_MS = 10000
const HASH_LENGTH = 8

export interface OpenGraphData {
  title: string | null
  description: string | null
  imageUrl: string | null
  cachedImagePath: string | null
  siteName: string | null
  url: string
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

async function cacheImage(
  imageUrl: string,
  cacheDir: string
): Promise<string | null> {
  try {
    const hash = crypto
      .createHash('md5')
      .update(imageUrl)
      .digest('hex')
      .slice(0, HASH_LENGTH)
    const ext = imageUrl.split('?')[0].split('.').pop()?.toLowerCase() ?? 'jpg'
    const safeExt = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'].includes(ext)
      ? ext
      : 'jpg'
    const filename = `${hash}.${safeExt}`
    const filePath = path.join(cacheDir, filename)
    const publicPath = `/og-cache/${filename}`

    try {
      await fs.access(filePath)
      return publicPath
    } catch {
      // File doesn't exist, download it
    }

    await fs.mkdir(cacheDir, { recursive: true })

    const response = await fetch(imageUrl, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })
    if (!response.ok) return null

    const buffer = await response.arrayBuffer()
    await fs.writeFile(filePath, Buffer.from(buffer))
    return publicPath
  } catch {
    return null
  }
}

export async function fetchOpenGraphData(url: string): Promise<OpenGraphData> {
  const cacheDir = path.join(process.cwd(), 'public', 'og-cache')

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; eligundry.com bot; +https://eligundry.com)',
      },
    })

    if (!response.ok) {
      return {
        title: null,
        description: null,
        imageUrl: null,
        cachedImagePath: null,
        siteName: null,
        url,
      }
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
      cachedImagePath = await cacheImage(absoluteImageUrl, cacheDir)
    }

    return { title, description, imageUrl, cachedImagePath, siteName, url }
  } catch {
    return {
      title: null,
      description: null,
      imageUrl: null,
      cachedImagePath: null,
      siteName: null,
      url,
    }
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
