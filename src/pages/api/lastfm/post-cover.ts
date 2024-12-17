import type { APIRoute } from 'astro'
import { getWeek } from 'date-fns'
import auth from '../../../lib/auth'
import bsky from '../../../lib/bluesky'
import lastfm from '../../../lib/lastfm'
import config from '../../../config'

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
  let period = formData.get('period') as '7day' | '1month' | '12month'

  if (
    typeof period !== 'string' ||
    (period !== '7day' && period !== '1month' && period !== '12month')
  ) {
    period = '7day'
  }

  const [topAlbums, collage] = await Promise.all([
    lastfm.getTopAlbums(config.lastFmUsername, period),
    lastfm.getCollage(config.lastFmUsername, period),
  ])
  const alt = topAlbums
    .slice(0, 9)
    .map(
      (album) =>
        `${album.name} by ${album.artist.name} [${album.playcount} scrobbles]`
    )
    .join(', ')
  const now = new Date()
  const text = {
    '7day': `Happy Friday! Here's what I've been listening to this week! https://www.last.fm/user/eli_pwnd/listening-report/year/${now.getFullYear()}/week/${getWeek(
      now
    )}`,
    '1month': `What a month! Here's what I've been listening to! https://www.last.fm/user/eli_pwnd/listening-report/year/${now.getFullYear()}/month/${now.getMonth() + 1
      }`,
    '12month': `What a year! Here's what I've been listening to! https://www.last.fm/user/eli_pwnd/listening-report/year/${now.getFullYear()}`,
  }

  const upload = await bsky.uploadImage(collage, 'image/jpeg')
  await bsky.sendPost(text[period], {
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

  return new Response(JSON.stringify({ ok: true, period, alt }), {
    headers: {
      'content-type': 'application/json',
    },
  })
}
