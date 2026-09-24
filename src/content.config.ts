import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import { file, glob } from 'astro/loaders'
import { parse as parseYaml } from 'yaml'
import { withOrder } from './lib/collections'
import { feelingsCollection } from './content/feelings'
import { createGoodreadsCollection } from './content/goodreads'
import config from './config'
import { createLastFmCoverCollection } from './content/lastfm'
import { linksCollection } from './content/links'

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
  website: z.url(),
  location: z.object({
    city: z.string(),
    region: z.string(),
    country: z.string(),
  }),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  printHide: z.boolean().optional(),
  // JSON Resume education fields (https://jsonresume.org/schema)
  area: z.string().optional(),
  studyType: z.string().optional(),
})

const resumeBasicsSchema = z.object({
  name: z.string(),
  label: z.string(),
  tagline: z.string(),
  email: z.email(),
  phone: z.string(),
  url: z.url(),
  location: z.object({
    city: z.string(),
    region: z.string(),
    countryCode: z.string(),
  }),
  profiles: z.array(
    z.object({
      network: z.string(),
      username: z.string(),
      url: z.url(),
    })
  ),
})

const resumeSkillSchema = z.object({
  name: z.string(),
  level: z.string().optional(),
  // Leading phrase of the sentence rendered on the page, e.g. "Fluent in"
  lead: z.string(),
  keywords: z.array(z.object({ name: z.string(), url: z.url() })),
  order: z.number(),
})

const resumeActivityRecordSchema = z.discriminatedUnion('section', [
  z.object({
    section: z.literal('projects'),
    name: z.string(),
    description: z.string().optional(),
    url: z.url().optional(),
    keywords: z.array(z.string()).optional(),
  }),
  z.object({
    section: z.literal('volunteer'),
    organization: z.string(),
    position: z.string().optional(),
    url: z.url().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    summary: z.string().optional(),
  }),
  z.object({
    section: z.literal('awards'),
    title: z.string(),
    date: z.string().optional(),
    awarder: z.string().optional(),
    summary: z.string().optional(),
  }),
  z.object({
    section: z.literal('publications'),
    // Slug of an entry in the talks collection
    talk: z.string(),
  }),
])

const resumeActivitySchema = z.object({
  // Markdown shown on the page. Trusted, so inline HTML is allowed.
  markdown: z.string(),
  children: z.array(z.string()).optional(),
  childrenClass: z.string().optional(),
  records: z.array(resumeActivityRecordSchema).default([]),
  order: z.number(),
})

const sectionSchema = z.object({
  page: z.string(),
})

const seasonalPlaylistSchema = z.object({
  spotifyId: z.string(),
  name: z.string(),
  description: z.string(),
  date: z.coerce.date(),
})

// For YAML lists whose order matters; see withOrder
const orderedYamlLoader = (fileName: string) =>
  file(fileName, { parser: (text) => withOrder(parseYaml(text)) })

const mdxLoader = (collection: string) =>
  glob({ pattern: '**/[^_]*.mdx', base: `./src/content/${collection}` })

export const collections = {
  blog: defineCollection({
    loader: mdxLoader('blog'),
    schema: ({ image }) =>
      blogSchema.extend({
        cover: image().optional(),
      }),
  }),
  talks: defineCollection({
    loader: mdxLoader('talks'),
    schema: ({ image }) =>
      talksSchema.extend({
        cover: image().optional(),
      }),
  }),
  sections: defineCollection({
    loader: mdxLoader('sections'),
    schema: sectionSchema,
  }),
  resumeExperiences: defineCollection({
    loader: mdxLoader('resumeExperiences'),
    schema: resumeExperiencesSchema,
  }),
  resumeBasics: defineCollection({
    loader: file('src/content/resumeBasics.yaml'),
    schema: resumeBasicsSchema,
  }),
  resumeSkills: defineCollection({
    loader: orderedYamlLoader('src/content/resumeSkills.yaml'),
    schema: resumeSkillSchema,
  }),
  resumeActivities: defineCollection({
    loader: orderedYamlLoader('src/content/resumeActivities.yaml'),
    schema: resumeActivitySchema,
  }),
  seasonalPlaylists: defineCollection({
    loader: file('src/content/seasonalPlaylists.yaml'),
    schema: seasonalPlaylistSchema,
  }),
  feelings: feelingsCollection,
  links: linksCollection,
  currentlyReading: createGoodreadsCollection({
    userID: config.goodreadsUserID,
    shelf: 'currently-reading',
    limit: 2,
  }),
  recentlyRead: createGoodreadsCollection({
    userID: config.goodreadsUserID,
    shelf: 'read',
    limit: 16,
    sort: 'date_read',
    order: 'd',
  }),
  lastfmCovers: createLastFmCoverCollection(config.lastFmUsername),
}
