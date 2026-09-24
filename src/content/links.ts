import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import type { Loader } from 'astro/loaders'
import { notionLoader } from '@astro-notion/loader'
import {
  notionPageSchema,
  propertySchema,
  transformedPropertySchema,
} from '@astro-notion/loader/schemas'
import { existsSync } from 'node:fs'
import path from 'node:path'
import rehypeShiki from '@shikijs/rehype'

export const linksSchema = notionPageSchema({
  properties: z.object({
    Title: transformedPropertySchema.title,
    Slug: transformedPropertySchema.rich_text,
    Description: transformedPropertySchema.rich_text.optional(),
    Tags: transformedPropertySchema.multi_select,
    URL: transformedPropertySchema.url,
    'Published At': transformedPropertySchema.date,
    'Created time': transformedPropertySchema.created_time,
    'Last edited time': propertySchema.last_edited_time,
  }),
})

export type LinksEntry = z.infer<typeof linksSchema>

export function getLinkPostDate(entry: LinksEntry): Date {
  return (
    entry.properties['Published At']?.start ?? entry.properties['Created time']
  )
}

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

  const isProd = !!process.env.PROD
  // Drop the loader's function schema, which Astro no longer supports, in
  // favor of the collection's linksSchema
  const { schema: _schema, ...inner } = notionLoader({
    auth: notionToken,
    database_id: notionDatabaseId,
    filter: isProd
      ? {
          property: 'Published At',
          date: { is_not_empty: true },
        }
      : undefined,
    rehypePlugins: [[rehypeShiki, { theme: 'material-theme-lighter' }]],
  }) as Loader & { schema?: unknown }

  return {
    ...inner,
    name: 'notion-loader/links',
    async load(ctx) {
      // The loader skips re-rendering pages that haven't changed since the
      // cached data store, but the images it downloaded for them aren't part
      // of that cache. If any are missing, start over so they're downloaded
      // again rather than failing the build.
      if (hasMissingNotionImages(ctx.store.values())) {
        ctx.logger.info('Notion images are missing; re-rendering all pages')
        ctx.store.clear()
      }

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

const notionImagePattern = /assets\/images\/notion\/([^"&\\]+)/g

function hasMissingNotionImages(entries: unknown[]): boolean {
  for (const entry of entries) {
    for (const [, image] of JSON.stringify(entry).matchAll(
      notionImagePattern
    )) {
      if (!existsSync(path.join('src/assets/images/notion', image))) {
        return true
      }
    }
  }

  return false
}

export const linksCollection = defineCollection({
  loader: createLinksLoader(),
  schema: linksSchema,
})
