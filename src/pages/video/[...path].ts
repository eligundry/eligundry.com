import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Headers as WorkerHeaders } from '@cloudflare/workers-types'

export const prerender = false

/**
 * Videos too big for Workers static assets (25 MiB per file) live in R2 under
 * the same path. Smaller ones in public/video are served as static assets and
 * never reach this route. Supports range requests so players can seek.
 */
export const GET: APIRoute = async ({ params, request }) => {
  const key = `video/${params.path}`
  const range = parseRange(request.headers.get('range'))
  const object = await env.MEDIA.get(key, {
    range,
    // The Workers and DOM type libraries each declare their own Headers and
    // ReadableStream; at runtime they're the same objects
    onlyIf: request.headers as unknown as WorkerHeaders,
  })

  if (!object) {
    return new Response('Not found', { status: 404 })
  }

  const headers = new Headers()
  object.writeHttpMetadata(headers as unknown as WorkerHeaders)
  headers.set('etag', object.httpEtag)
  headers.set('accept-ranges', 'bytes')
  headers.set('cache-control', 'public, max-age=86400')

  // onlyIf matched an If-None-Match / If-Modified-Since: no body
  if (!('body' in object)) {
    return new Response(null, { status: 304, headers })
  }

  const body = object.body as unknown as ReadableStream

  if (range && 'offset' in range) {
    const end = range.length ? range.offset + range.length - 1 : object.size - 1
    headers.set('content-range', `bytes ${range.offset}-${end}/${object.size}`)
    headers.set('content-length', String(end - range.offset + 1))
    return new Response(body, { status: 206, headers })
  }

  if (range && 'suffix' in range) {
    const start = Math.max(object.size - range.suffix, 0)
    headers.set(
      'content-range',
      `bytes ${start}-${object.size - 1}/${object.size}`
    )
    headers.set('content-length', String(object.size - start))
    return new Response(body, { status: 206, headers })
  }

  headers.set('content-length', String(object.size))
  return new Response(body, { headers })
}

function parseRange(
  header: string | null
): { offset: number; length?: number } | { suffix: number } | undefined {
  const match = header?.match(/^bytes=(\d*)-(\d*)$/)

  if (!match || (!match[1] && !match[2])) {
    return undefined
  }

  if (!match[1]) {
    return { suffix: Number(match[2]) }
  }

  const offset = Number(match[1])
  return match[2]
    ? { offset, length: Number(match[2]) - offset + 1 }
    : { offset }
}
