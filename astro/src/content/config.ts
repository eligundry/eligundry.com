import { z, defineCollection } from 'astro:content'

const commonFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  cover: z.string().optional(),
  draft: z.boolean().default(false),
  date: z.coerce.date(),
})

const blogSchema = commonFrontmatterSchema.extend({
  tags: z.array(z.string()).min(1),
  favoriteIndex: z.number().optional(),
})

const talksSchema = commonFrontmatterSchema.extend({
  location: z.string(),
})

const resumeExperiencesSchema = z.object({
  type: z.enum(['work', 'education']),
  position: z.string(),
  organization: z.string(),
  website: z.string().url(),
  location: z.object({
    city: z.string(),
    region: z.string(),
    country: z.string(),
  }),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  printHide: z.boolean().optional(),
})

const sectionSchema = z.object({
  page: z.string(),
})

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
  resumeExperiences: defineCollection({
    schema: resumeExperiencesSchema,
  }),
}
