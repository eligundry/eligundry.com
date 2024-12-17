import type { APIRoute } from 'astro'
import daylio from '../../../lib/daylio'

export const GET: APIRoute = async () => {
  const entry = await daylio.getLatest()

  return new Response(JSON.stringify(entry), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  })
}
