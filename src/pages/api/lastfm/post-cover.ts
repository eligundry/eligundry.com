import type { APIRoute } from 'astro'
import auth from '../../../lib/auth'
import bsky from '../../../lib/bluesky'
import lastfm from '../../../lib/lastfm'
import config from '../../../config'
import { generatePostText } from '../../../lib/ai/lastfm-post-generator'

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  if (!auth.check(request.headers.get('authorization'))) {
    return new Response(null, {
      status: 401,
      headers: {
        'www-authenticate': 'Basic realm="daylio"',
      },
    })
  }

  const formData = await request.formData()
  let period = (formData.get('period') ?? '7day') as
    | '7day'
    | '1month'
    | '12month'

  if (
    typeof period !== 'string' ||
    (period !== '7day' && period !== '1month' && period !== '12month')
  ) {
    period = '7day'
  }

  const { albums: topAlbums, collage } = await lastfm.getCollage(
    config.lastFmUsername,
    period
  )

  const alt = topAlbums
    .slice(0, 9)
    .map(
      (album) => `${album.album} by ${album.artist} [${album.count} scrobbles]`
    )
    .join(', ')

  // Generate AI post text - no fallback, if this fails, the whole request fails
  const text = await generatePostText(topAlbums, period)

  const upload = await bsky.uploadImage(collage, 'image/jpeg')
  await bsky.sendPost(text, {
    embed: {
      $type: 'app.bsky.embed.images',
      images: [
        {
          image: upload.data.blob,
          alt: `Last.fm collage: ${alt}`,
        },
      ],
    },
  })

  return new Response(JSON.stringify({ ok: true, period, alt, text }), {
    headers: {
      'content-type': 'application/json',
    },
  })
}
