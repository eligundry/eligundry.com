import type { APIRoute } from 'astro'
import auth from '../../../lib/auth'
import { postCollage, type CollagePeriod } from '../../../lib/lastfmCollage'

export const prerender = false

const periods: CollagePeriod[] = ['7day', '1month', '12month']

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
  const requested = formData.get('period')
  const period = periods.find((p) => p === requested) ?? '7day'

  return new Response(JSON.stringify(await postCollage(period)), {
    headers: {
      'content-type': 'application/json',
    },
  })
}
