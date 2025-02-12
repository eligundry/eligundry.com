import { defineCollection } from 'astro:content'
import daylio from '../lib/daylio'

export const feelingsCollection = defineCollection({
  loader: async () =>
    (await daylio.getAll()).map((entry) => ({
      id: entry.time.toISOString(),
      ...entry,
    })),
  schema: daylio.schema,
})
