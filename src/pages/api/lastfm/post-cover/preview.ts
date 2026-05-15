import type { APIRoute } from 'astro'
import auth from '../../../../lib/auth'
import lastfm from '../../../../lib/lastfm'
import config from '../../../../config'
import { generatePostText } from '../../../../lib/ai/lastfm-post-generator'

export const prerender = false

export const GET: APIRoute = async ({ request, url }) => {
  if (!auth.check(request.headers.get('authorization'))) {
    return new Response(null, {
      status: 401,
      headers: {
        'www-authenticate': 'Basic realm="lastfm"',
      },
    })
  }

  let period = (url.searchParams.get('period') ?? '7day') as
    | '7day'
    | '1month'
    | '12month'

  if (period !== '7day' && period !== '1month' && period !== '12month') {
    period = '7day'
  }

  const { albums: topAlbums, collage } = await lastfm.getCollage(
    config.lastFmUsername,
    period
  )

  const headers: Record<string, string> = {
    'content-type': 'image/jpeg',
    'cache-control': 'no-cache',
  }

  // If text generation is requested, include it in response headers
  const text = await generatePostText(topAlbums, period)
  const alt = topAlbums
    .slice(0, 9)
    .map(
      (album) => `${album.album} by ${album.artist} [${album.count} scrobbles]`
    )
    .join(', ')

  headers['x-post-text'] = encodeURIComponent(text)
  headers['x-alt-text'] = encodeURIComponent(alt)

  return new Response(collage, { headers })
}
