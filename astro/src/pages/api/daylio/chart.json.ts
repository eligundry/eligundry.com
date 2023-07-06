import type { APIRoute } from 'astro'
import dateFns from 'date-fns'
import daylio from '../../../lib/daylio'

export const get: APIRoute = async () => {
  const entries = await daylio.getChartData(dateFns.subDays(new Date(), 45))

  return new Response(JSON.stringify(entries), {
    headers: {
      'content-type': 'application/json',
    },
  })
}
