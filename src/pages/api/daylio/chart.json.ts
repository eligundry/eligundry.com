import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

export const GET: APIRoute = async () => {
  const entries = await getCollection('feelings').then((entries) =>
    entries.slice(0, 30).map(({ data }) => ({ x: data.slug, y: data.score }))
  )

  return new Response(JSON.stringify(entries), {
    headers: {
      'content-type': 'application/json',
    },
  })
}
