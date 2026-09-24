import { getCollection, getEntry } from 'astro:content'
import config from '../../config'
import {
  parseExperienceBody,
  toIsoDate,
  trustedText,
  type ActivityNode,
  type ActivityRecord,
  type ExperienceNode,
  type ExperienceRole,
  type ResumeSource,
  type SkillNode,
} from './model'

/** Every title held at a job, newest first. */
function experienceRoles(
  position: string,
  startDate: Date,
  promotions: { position: string; startDate: Date }[],
  endDate?: Date
): ExperienceRole[] {
  const roles = [{ position, startDate }, ...promotions]
  return roles
    .map((role, i) => {
      const roleEnd = roles[i + 1]?.startDate ?? endDate
      return {
        position: role.position,
        startDate: toIsoDate(role.startDate),
        endDate: roleEnd ? toIsoDate(roleEnd) : undefined,
      }
    })
    .reverse()
}

/** Builds the resume from the content collections. */
export async function getResumeSource(): Promise<ResumeSource> {
  const [basics, experiences, skills, activities] = await Promise.all([
    getEntry('resumeBasics', 'eli'),
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
      position: data.promotions?.at(-1)?.position ?? data.position,
      roles: data.promotions?.length
        ? experienceRoles(
            data.position,
            data.startDate,
            data.promotions,
            data.endDate
          )
        : undefined,
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
            url: new URL(`/talks/${talk.slug}/`, config.url).toString(),
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

  return {
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
