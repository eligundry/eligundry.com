import type { APIRoute } from 'astro'
import auth from '../../../lib/auth'
import lastfm from '../../../lib/lastfm'
import config from '../../../config'

export const prerender = false

export const GET: APIRoute = async ({ request }) => {
  if (!auth.check(request.headers.get('authorization'))) {
    return new Response(null, {
      status: 401,
      headers: {
        'www-authenticate': 'Basic realm="daylio"',
      },
    })
  }

  // const formData = await request.formData()
  const url = new URL(request.url)
  let period = (url.searchParams.get('period') ?? '7day') as
    | '7day'
    | '1month'
    | '12month'

  if (
    typeof period !== 'string' ||
    (period !== '7day' && period !== '1month' && period !== '12month')
  ) {
    period = '7day'
  }

  const { collage } = await lastfm.getCollage(config.lastFmUsername, period)

  return new Response(collage, {
    headers: {
      'content-type': 'image/jpeg',
    },
  })
}
