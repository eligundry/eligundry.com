import { z, defineCollection } from 'astro:content'
import { file } from 'astro/loaders'
import { feelingsCollection } from './feelings'
import { createGoodreadsCollection } from './goodreads'
import config from '../config'
import { createLastFmCoverCollection } from './lastfm'
import { linksCollection } from './links'

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
  // JSON Resume education fields (https://jsonresume.org/schema)
  area: z.string().optional(),
  studyType: z.string().optional(),
})

const resumeSkillSchema = z.object({
  name: z.string(),
  level: z.string().optional(),
  // Leading phrase of the sentence rendered on the page, e.g. "Fluent in"
  lead: z.string(),
  keywords: z.array(z.object({ name: z.string(), url: z.string().url() })),
})

const resumeActivityRecordSchema = z.discriminatedUnion('section', [
  z.object({
    section: z.literal('projects'),
    name: z.string(),
    description: z.string().optional(),
    url: z.string().url().optional(),
    keywords: z.array(z.string()).optional(),
  }),
  z.object({
    section: z.literal('volunteer'),
    organization: z.string(),
    position: z.string().optional(),
    url: z.string().url().optional(),
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

export const collections = {
  blog: defineCollection({
    schema: ({ image }) =>
      blogSchema.extend({
        cover: image().optional(),
      }),
  }),
  talks: defineCollection({
    schema: ({ image }) =>
      talksSchema.extend({
        cover: image().optional(),
      }),
  }),
  sections: defineCollection({
    schema: sectionSchema,
  }),
  resumeExperiences: defineCollection({
    schema: resumeExperiencesSchema,
  }),
  resumeSkills: defineCollection({
    loader: file('src/content/resumeSkills.yaml'),
    schema: resumeSkillSchema,
  }),
  resumeActivities: defineCollection({
    loader: file('src/content/resumeActivities.yaml'),
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
