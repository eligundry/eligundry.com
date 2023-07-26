import type { APIRoute } from 'astro'
import sample from 'lodash/sample'
import auth from '../../../lib/auth'
import bsky from '../../../lib/bluesky'
import lastfm from '../../../lib/lastfm'
import config from '../../../config'

export const prerender = false

const text = ["It's Friday! Here's what I've been listening to this week!"]

export const post: APIRoute = async ({ request }) => {
  if (!auth.check(request.headers.get('authorization'))) {
    return new Response(null, {
      status: 401,
      headers: {
        'www-authenticate': 'Basic realm="daylio"',
      },
    })
  }

  const formData = await request.formData()
  let period = formData.get('period')

  if (typeof period !== 'string') {
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

  const upload = await bsky.uploadImage(collage, 'image/jpeg')
  await bsky.sendPost(sample(text), {
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

  return {
    body: 'ok',
  }
}
