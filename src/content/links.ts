import { defineCollection, z } from 'astro:content'
import type { Loader } from 'astro/loaders'
import { notionLoader } from '@astro-notion/loader'
import {
  notionPageSchema,
  propertySchema,
  transformedPropertySchema,
} from '@astro-notion/loader/schemas'

export const linksSchema = notionPageSchema({
  properties: z.object({
    Name: transformedPropertySchema.title,
    Slug: transformedPropertySchema.rich_text,
    Description: transformedPropertySchema.rich_text.optional(),
    Tags: transformedPropertySchema.multi_select,
    URL: transformedPropertySchema.url,
    Published: transformedPropertySchema.checkbox,
    Created: transformedPropertySchema.created_time,
    'Last edited time': propertySchema.last_edited_time,
  }),
})

export type LinksEntry = z.infer<typeof linksSchema>

const notionToken = import.meta.env.NOTION_TOKEN
// Notion view URLs include a `?v=<viewId>` suffix that the API rejects; strip it.
const notionDatabaseId = import.meta.env.NOTION_LINKS_DATABASE_ID?.split('?')[0]

function createLinksLoader(): Loader {
  if (!notionToken || !notionDatabaseId) {
    return {
      name: 'notion-loader/links-noop',
      async load({ logger }) {
        logger.warn(
          'NOTION_TOKEN or NOTION_LINKS_DATABASE_ID is not set; skipping link blog content.'
        )
      },
    }
  }

  const inner = notionLoader({
    auth: notionToken,
    database_id: notionDatabaseId,
    filter: import.meta.env.PROD
      ? {
          property: 'Published',
          checkbox: { equals: true },
        }
      : undefined,
  })

  return {
    ...inner,
    name: 'notion-loader/links',
    async load(ctx) {
      try {
        await inner.load(ctx)
      } catch (err) {
        ctx.logger.warn(
          `Failed to load Notion link blog (${(err as Error).message}); continuing without link posts.`
        )
      }
    },
  }
}

export const linksCollection = defineCollection({
  loader: createLinksLoader(),
  schema: linksSchema,
})
