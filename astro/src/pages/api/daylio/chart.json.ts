import type { APIRoute } from 'astro'
import dateFns from 'date-fns'
import daylio from '../../../lib/daylio'

export const get: APIRoute = async () => ({
  body: JSON.stringify(
    await daylio.getChartData(dateFns.subMonths(new Date(), 2))
  ),
  headers: {
    'content-type': 'application/json',
  },
})
