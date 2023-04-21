import { z, defineCollection } from 'astro:content'

const commonFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  cover: z.string().optional(),
  draft: z.boolean().default(false),
  date: z.string().transform((input) => {
    try {
      return new Date(input)
    } catch (e) {
      return new Date()
    }
  }),
})

const blogSchema = commonFrontmatterSchema.extend({
  tags: z.array(z.string()).min(1),
  favoriteIndex: z.number().optional(),
})

const talksSchema = commonFrontmatterSchema.extend({
  location: z.string(),
})

const sectionSchema = z.object({})

export const collections = {
  blog: defineCollection({
    schema: blogSchema,
    slug: ({ collection, defaultSlug }) => `/${collection}/${defaultSlug}/`,
  }),
  talks: defineCollection({
    schema: talksSchema,
    slug: ({ collection, defaultSlug }) => `/${collection}/${defaultSlug}/`,
  }),
  sections: defineCollection({
    schema: sectionSchema,
  }),
}
