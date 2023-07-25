import type { APIRoute } from 'astro'
import daylio from '../../../lib/daylio'

export const prerender = false

export const get: APIRoute = async () => {
  const entries = await daylio.getAll()

  return new Response(JSON.stringify(entries), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  })
}
