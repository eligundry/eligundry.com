import { getCollection, getEntry } from 'astro:content'
import config from '../../config'
import { byOrder } from '../collections'
import { collectTechnologies } from './technologies'
import {
  markTechnologies,
  normalizeRoles,
  parseExperienceBody,
  toIsoDate,
  trustedText,
  type ActivityNode,
  type ActivityRecord,
  type ExperienceNode,
  type ResumeSource,
  type SkillNode,
} from './model'

/** Builds the resume from the content collections. */
export async function getResumeSource(): Promise<ResumeSource> {
  const [basics, experiences, skills, activities] = await Promise.all([
    getEntry('resumeBasics', 'eli'),
    getCollection('resumeExperiences'),
    getCollection('resumeSkills'),
    getCollection('resumeActivities'),
  ])

  const experienceNodes: ExperienceNode[] = experiences
    .map(({ id, data, body }): ExperienceNode => {
      const roles =
        typeof data.position === 'string'
          ? undefined
          : normalizeRoles(
              data.position.map((role) => ({
                title: role.title,
                startDate: toIsoDate(role.startDate),
                endDate: role.endDate ? toIsoDate(role.endDate) : undefined,
              }))
            )
      const newest = roles?.[0]
      const oldest = roles?.[roles.length - 1]
      // The schema requires startDate when position is a single title.
      const startDate = oldest?.startDate ?? toIsoDate(data.startDate!)
      const endDate = newest
        ? newest.endDate
        : data.endDate && toIsoDate(data.endDate)
      return {
        id,
        type: data.type,
        organization: data.organization,
        position: newest?.title ?? (data.position as string),
        url: data.website,
        location: {
          city: data.location.city,
          region: data.location.region,
          countryCode: data.location.country,
        },
        startDate,
        endDate,
        area: data.area,
        studyType: data.studyType,
        printHide: data.printHide,
        roles: roles && roles.length > 1 ? roles : undefined,
        ...parseExperienceBody(id, body ?? ''),
      }
    })
    .sort((a, b) => b.startDate.localeCompare(a.startDate))

  const skillNodes: SkillNode[] = skills.sort(byOrder).map(({ id, data }) => ({
    id: `skills:${id}`,
    name: data.name,
    level: data.level,
    lead: data.lead,
    keywords: data.keywords,
  }))

  const activityNodes: ActivityNode[] = await Promise.all(
    activities.sort(byOrder).map(async ({ id, data }) => ({
      ...trustedText(`activities:${id}`, data.markdown),
      children: data.children?.map((child, i) =>
        trustedText(`activities:${id}:child:${i}`, child)
      ),
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
            url: new URL(`/talks/${talk.id}/`, config.url).toString(),
            summary: talk.data.description,
          }
        })
      ),
    }))
  )

  if (!basics) {
    throw new Error('Missing "eli" entry in src/content/resumeBasics.yaml')
  }
  const { label, tagline, ...contact } = basics.data

  const source: ResumeSource = {
    basics: {
      ...contact,
      label: trustedText('basics:label', label),
      tagline: trustedText('basics:tagline', tagline),
      summary: trustedText('basics:summary', ''),
    },
    sections: [
      {
        id: 'section:work',
        title: 'Work',
        printTitle: 'Curated Work History',
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

  return markTechnologies(
    source,
    collectTechnologies({ skills: skillNodes, experiences: experienceNodes })
  )
}
