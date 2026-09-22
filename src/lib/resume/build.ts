import { createMarkdownProcessor } from '@astrojs/markdown-remark'
import { getCollection, getEntry } from 'astro:content'
import type { Node } from 'unist'
import { visit } from 'unist-util-visit'
import config from '../../config'
import { resumeBasics } from './basics'
import {
  parseExperienceBody,
  toIsoDate,
  type ActivityNode,
  type ActivityRecord,
  type ExperienceNode,
  type ResumeSource,
  type SkillNode,
} from './model'

/** Builds the resume from the content collections. */
export async function getResumeSource(): Promise<ResumeSource> {
  const [experiences, skills, activities] = await Promise.all([
    getCollection('resumeExperiences'),
    getCollection('resumeSkills'),
    getCollection('resumeActivities'),
  ])

  const experienceNodes: ExperienceNode[] = experiences
    .sort((a, b) => b.data.startDate.getTime() - a.data.startDate.getTime())
    .map(({ slug, data, body }) => ({
      id: slug,
      type: data.type,
      organization: data.organization,
      position: data.position,
      url: data.website,
      location: {
        city: data.location.city,
        region: data.location.region,
        countryCode: data.location.country,
      },
      startDate: toIsoDate(data.startDate),
      endDate: data.endDate ? toIsoDate(data.endDate) : undefined,
      area: data.area,
      studyType: data.studyType,
      printHide: data.printHide,
      ...parseExperienceBody(slug, body),
    }))

  const skillNodes: SkillNode[] = skills.map(({ id, data }) => ({
    id: `skills:${id}`,
    name: data.name,
    level: data.level,
    lead: data.lead,
    keywords: data.keywords,
  }))

  const activityNodes: ActivityNode[] = await Promise.all(
    activities.map(async ({ id, data }) => ({
      id: `activities:${id}`,
      markdown: data.markdown,
      children: data.children,
      childrenClass: data.childrenClass,
      records: await Promise.all(
        data.records.map(async (record): Promise<ActivityRecord> => {
          if (record.section !== 'publications') {
            return record
          }
          const talk = await getEntry('talks', record.talk)
          if (!talk) {
            throw new Error(
              `Resume activity references missing talk "${record.talk}"`
            )
          }
          return {
            section: 'publications',
            name: talk.data.title,
            publisher: talk.data.location,
            releaseDate: toIsoDate(talk.data.date),
            url: new URL(`/talks/${talk.slug}/`, config.url).toString(),
            summary: talk.data.description,
          }
        })
      ),
    }))
  )

  return {
    basics: {
      ...resumeBasics,
      label: { id: 'basics:label', markdown: resumeBasics.label },
      tagline: { id: 'basics:tagline', markdown: resumeBasics.tagline },
      summary: { id: 'basics:summary', markdown: '' },
    },
    sections: [
      {
        id: 'section:work',
        title: 'Work',
        printTitle: 'Selected Work History',
        items: experienceNodes.filter((e) => e.type === 'work'),
      },
      {
        id: 'section:education',
        title: 'Education',
        items: experienceNodes.filter((e) => e.type === 'education'),
      },
      {
        id: 'section:skills',
        title: 'Skills & Technologies',
        items: skillNodes,
      },
      {
        id: 'section:activities',
        title: 'Activities & Interests',
        items: activityNodes,
      },
    ],
  }
}

type LinkProperties = Record<string, string>

/** Adds properties to every link that doesn't already set them. */
const rehypeLinkProperties =
  (properties: LinkProperties) => () => (tree: Node) => {
    visit(tree, 'element', (node) => {
      const element = node as Node & {
        tagName: string
        properties: Record<string, unknown>
      }
      if (element.tagName === 'a') {
        element.properties = { ...properties, ...element.properties }
      }
    })
  }

const processors = new Map<string, ReturnType<typeof createMarkdownProcessor>>()

/**
 * Renders trusted, build-time markdown (inline HTML allowed) to HTML without
 * the wrapping paragraph. `linkProperties` are added to every link.
 */
export async function renderTrustedMarkdown(
  markdown: string,
  linkProperties: LinkProperties = {}
): Promise<string> {
  const key = JSON.stringify(linkProperties)
  if (!processors.has(key)) {
    processors.set(
      key,
      createMarkdownProcessor({
        syntaxHighlight: false,
        rehypePlugins: [rehypeLinkProperties(linkProperties)],
      })
    )
  }
  const { code } = await (await processors.get(key)!).render(markdown)
  const html = code.trim()
  const single = html.match(/^<p>([\s\S]*)<\/p>$/)
  return single && !single[1].includes('<p>') ? single[1] : html
}
