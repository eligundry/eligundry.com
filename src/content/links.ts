import { defineCollection, z } from 'astro:content'
import { notionLoader } from '@astro-notion/loader'
import {
  notionPageSchema,
  propertySchema,
  transformedPropertySchema,
} from '@astro-notion/loader/schemas'

export const linksSchema = notionPageSchema({
  properties: z.object({
    Slug: transformedPropertySchema.title,
    Tags: transformedPropertySchema.multi_select,
    URL: transformedPropertySchema.url,
    Published: transformedPropertySchema.checkbox,
    Created: transformedPropertySchema.created_time,
    'Last edited time': propertySchema.last_edited_time,
  }),
})

export type LinksEntry = z.infer<typeof linksSchema>

export const linksCollection = defineCollection({
  loader: notionLoader({
    auth: import.meta.env.NOTION_TOKEN,
    database_id: import.meta.env.NOTION_LINKS_DATABASE_ID,
    filter: import.meta.env.PROD
      ? {
          property: 'Published',
          checkbox: { equals: true },
        }
      : undefined,
  }),
  schema: linksSchema,
})
