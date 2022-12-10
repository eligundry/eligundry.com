import type { APIRoute } from 'astro'
import dateFns from 'date-fns'
import daylio from '../../../lib/daylio'

export const get: APIRoute = async () => ({
  body: JSON.stringify(
    await daylio.getChartData(dateFns.subDays(new Date(), 45))
  ),
  headers: {
    'content-type': 'application/json',
  },
})
