import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

export const GET: APIRoute = async () => {
  const entries = await getCollection('feelings').then((records) =>
    records.slice(0).map((record) => record.data)
  )

  return new Response(JSON.stringify(entries[0]), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  })
}
