import { remark } from 'remark'
import type { List, ListItem, RootContent } from 'mdast'
import type { ResumeBasics } from './basics'
import { markdownToPlain, skillLinePlain, type SkillKeyword } from './markdown'

// The resume is modelled in two layers:
//
// 1. `ResumeSource`: a normalized tree with a stable `id` on everything the
//    tailoring tools can target (sections, experiences, bullets, skills,
//    activities). Pure data, safe to embed in the page and to tailor in the
//    browser.
// 2. `EliResume`: the published shape. It's a JSON Resume v1.0.0 document plus
//    `x-` prefixed extension keys (ids, markdown, visibility, section order).
//    `toJsonResume()` strips the extensions for /resume.json.

export const JSON_RESUME_SCHEMA =
  'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json'

export type SectionId = 'work' | 'education' | 'skills' | 'activities'

export interface TextNode {
  id: string
  markdown: string
  hidden?: boolean
  /** Added by tailoring rather than written in the content files. */
  added?: boolean
}

export interface ExperienceNode {
  id: string
  type: 'work' | 'education'
  organization: string
  position: string
  url: string
  location: { city: string; region: string; countryCode: string }
  startDate: string
  endDate?: string
  area?: string
  studyType?: string
  printHide?: boolean
  hidden?: boolean
  summary?: TextNode
  highlights: TextNode[]
}

export interface SkillNode {
  id: string
  name: string
  level?: string
  lead: string
  keywords: SkillKeyword[]
  /** Freeform replacement for the rendered sentence. */
  markdown?: string
  hidden?: boolean
  added?: boolean
}

export type ActivityRecord =
  | {
      section: 'projects'
      name: string
      description?: string
      url?: string
      keywords?: string[]
    }
  | {
      section: 'volunteer'
      organization: string
      position?: string
      url?: string
      startDate?: string
      endDate?: string
      summary?: string
    }
  | {
      section: 'awards'
      title: string
      date?: string
      awarder?: string
      summary?: string
    }
  | {
      section: 'publications'
      name: string
      publisher?: string
      releaseDate?: string
      url?: string
      summary?: string
    }

export interface ActivityNode {
  id: string
  markdown: string
  children?: string[]
  childrenClass?: string
  records: ActivityRecord[]
  hidden?: boolean
  added?: boolean
}

interface SectionBase<Id extends SectionId, Item> {
  id: `section:${Id}`
  title: string
  /** Title used when printed, if different. */
  printTitle?: string
  hidden?: boolean
  items: Item[]
}

export type ResumeSection =
  | SectionBase<'work', ExperienceNode>
  | SectionBase<'education', ExperienceNode>
  | SectionBase<'skills', SkillNode>
  | SectionBase<'activities', ActivityNode>

export interface ResumeSource {
  basics: Omit<ResumeBasics, 'tagline' | 'label'> & {
    tagline: TextNode
    label: TextNode
    summary: TextNode
  }
  sections: ResumeSection[]
}

// ---------------------------------------------------------------------------
// Building the source

/** YYYY-MM-DD in UTC, matching JSON Resume's iso8601 definition. */
export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function sliceNode(
  source: string,
  nodes: RootContent[] | ListItem['children']
): string {
  const start = nodes[0]?.position?.start.offset
  const end = nodes[nodes.length - 1]?.position?.end.offset
  if (start === undefined || end === undefined) {
    return ''
  }
  return source
    .slice(start, end)
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .trim()
}

/**
 * Splits an experience's markdown body into a summary (paragraphs) and
 * highlights (top-level list items), keeping each item's original markdown.
 */
export function parseExperienceBody(
  id: string,
  body: string
): Pick<ExperienceNode, 'summary' | 'highlights'> {
  const tree = remark().parse(body)
  const paragraphs: string[] = []
  const highlights: TextNode[] = []

  for (const node of tree.children) {
    if (node.type === 'list') {
      for (const item of (node as List).children) {
        highlights.push({
          id: `${id}:${highlights.length}`,
          markdown: sliceNode(body, item.children),
        })
      }
    } else if (node.type !== 'yaml') {
      const markdown = sliceNode(body, [node])
      if (markdown) {
        paragraphs.push(markdown)
      }
    }
  }

  return {
    summary: paragraphs.length
      ? { id: `${id}:summary`, markdown: paragraphs.join('\n\n') }
      : undefined,
    highlights,
  }
}

// ---------------------------------------------------------------------------
// Lookup helpers

export type ResumeNodeRef =
  | { kind: 'section'; node: ResumeSection }
  | { kind: 'sectionTitle'; node: ResumeSection }
  | { kind: 'experience'; node: ExperienceNode; section: ResumeSection }
  | { kind: 'highlight'; node: TextNode; parent: ExperienceNode }
  | { kind: 'summary'; node: TextNode; parent: ExperienceNode }
  | { kind: 'skill'; node: SkillNode; section: ResumeSection }
  | { kind: 'activity'; node: ActivityNode; section: ResumeSection }
  | { kind: 'basics'; node: TextNode }

export function indexResume(source: ResumeSource): Map<string, ResumeNodeRef> {
  const index = new Map<string, ResumeNodeRef>()
  const { label, tagline, summary } = source.basics

  for (const node of [label, tagline, summary]) {
    index.set(node.id, { kind: 'basics', node })
  }

  for (const section of source.sections) {
    index.set(section.id, { kind: 'section', node: section })
    index.set(`${section.id}:title`, { kind: 'sectionTitle', node: section })

    for (const item of section.items) {
      if (section.id === 'section:work' || section.id === 'section:education') {
        const experience = item as ExperienceNode
        index.set(experience.id, {
          kind: 'experience',
          node: experience,
          section,
        })
        if (experience.summary) {
          index.set(experience.summary.id, {
            kind: 'summary',
            node: experience.summary,
            parent: experience,
          })
        }
        for (const highlight of experience.highlights) {
          index.set(highlight.id, {
            kind: 'highlight',
            node: highlight,
            parent: experience,
          })
        }
      } else if (section.id === 'section:skills') {
        index.set(item.id, { kind: 'skill', node: item as SkillNode, section })
      } else {
        index.set(item.id, {
          kind: 'activity',
          node: item as ActivityNode,
          section,
        })
      }
    }
  }

  return index
}

/** Markdown for a skill line, whether it's been rewritten or not. */
export function skillMarkdown(skill: SkillNode): string {
  if (skill.markdown !== undefined) {
    return skill.markdown
  }
  return skillLinePlain(skill.lead, skill.keywords)
}

// ---------------------------------------------------------------------------
// JSON Resume superset

type XKeys = { [key: `x-${string}`]: unknown }

export interface JsonResume {
  $schema?: string
  basics?: Record<string, unknown>
  work?: Record<string, unknown>[]
  volunteer?: Record<string, unknown>[]
  education?: Record<string, unknown>[]
  awards?: Record<string, unknown>[]
  certificates?: Record<string, unknown>[]
  publications?: Record<string, unknown>[]
  skills?: Record<string, unknown>[]
  languages?: Record<string, unknown>[]
  interests?: Record<string, unknown>[]
  references?: Record<string, unknown>[]
  projects?: Record<string, unknown>[]
  meta?: Record<string, unknown>
}

export type EliResume = JsonResume & XKeys

export interface ResumeMeta {
  canonical?: string
  version?: string
  lastModified?: string
}

function compact<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, v]) => {
      if (v === undefined || v === null || v === '') return false
      if (Array.isArray(v) && v.length === 0) return false
      return true
    })
  ) as T
}

function plainText(node: TextNode | undefined): string | undefined {
  if (!node || node.hidden) return undefined
  return markdownToPlain(node.markdown) || undefined
}

function visibleHighlights(experience: ExperienceNode): string[] {
  return experience.highlights
    .filter((h) => !h.hidden)
    .map((h) => markdownToPlain(h.markdown))
}

type ItemsOf<Id extends SectionId> = Extract<
  ResumeSection,
  { id: `section:${Id}` }
>['items']

function sectionItems<Id extends SectionId>(
  source: ResumeSource,
  id: Id
): ItemsOf<Id> {
  const section = source.sections.find((s) => s.id === `section:${id}`)
  return (section?.items ?? []) as unknown as ItemsOf<Id>
}

function formatLocation(location: ExperienceNode['location']): string {
  return [location.city, location.region].filter(Boolean).join(', ')
}

/**
 * The resume as JSON Resume plus `x-` extensions. Hidden things are kept, but
 * flagged with `x-hidden`, so an agent can see and restore them.
 */
export function toSuperset(
  source: ResumeSource,
  meta: ResumeMeta = {}
): EliResume {
  const { basics } = source
  const sectionHidden = (id: SectionId) =>
    Boolean(source.sections.find((s) => s.id === `section:${id}`)?.hidden)

  const work = sectionItems(source, 'work').map((job) =>
    compact({
      name: job.organization,
      position: job.position,
      url: job.url,
      location: formatLocation(job.location),
      startDate: job.startDate,
      endDate: job.endDate,
      summary: plainText(job.summary),
      highlights: visibleHighlights(job),
      'x-id': job.id,
      'x-hidden': job.hidden || sectionHidden('work') || undefined,
      'x-printHide': job.printHide || undefined,
      'x-summary': job.summary,
      'x-highlights': job.highlights,
    })
  )

  const education = sectionItems(source, 'education').map((school) =>
    compact({
      institution: school.organization,
      url: school.url,
      area: school.area,
      studyType: school.studyType,
      startDate: school.startDate,
      endDate: school.endDate,
      'x-id': school.id,
      'x-position': school.position,
      'x-location': formatLocation(school.location),
      'x-summary': school.summary,
      'x-hidden': school.hidden || sectionHidden('education') || undefined,
      'x-printHide': school.printHide || undefined,
      'x-highlights': school.highlights,
    })
  )

  const skills = sectionItems(source, 'skills').map((skill) =>
    compact({
      name: skill.name,
      level: skill.level,
      keywords: skill.keywords.map((k) => k.name),
      'x-id': skill.id,
      'x-hidden': skill.hidden || sectionHidden('skills') || undefined,
      'x-lead': skill.lead,
      'x-keywords': skill.keywords,
      'x-markdown': skill.markdown,
    })
  )

  const records: Record<ActivityRecord['section'], Record<string, unknown>[]> =
    { projects: [], volunteer: [], awards: [], publications: [] }
  const activities = sectionItems(source, 'activities')
  for (const activity of activities) {
    const hidden = activity.hidden || sectionHidden('activities')
    for (const { section, ...record } of activity.records) {
      records[section].push(
        compact({
          ...record,
          'x-activity': activity.id,
          'x-hidden': hidden || undefined,
        })
      )
    }
  }

  return compact({
    $schema: JSON_RESUME_SCHEMA,
    basics: compact({
      name: basics.name,
      label: basics.label.markdown,
      email: basics.email,
      phone: basics.phone,
      url: basics.url,
      summary: plainText(basics.summary),
      location: basics.location,
      profiles: basics.profiles,
      'x-tagline': basics.tagline.markdown,
      'x-summaryMarkdown': basics.summary.markdown || undefined,
    }),
    work,
    education,
    skills,
    ...records,
    meta: compact({ ...meta }),
    'x-sections': source.sections.map((section) =>
      compact({
        'x-id': section.id,
        title: section.title,
        printTitle: section.printTitle,
        hidden: section.hidden || undefined,
        items: section.items.map((item) => item.id),
      })
    ),
    'x-activities': activities,
  }) as EliResume
}

function stripExtensions(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value
      .filter(
        (item) =>
          !(item && typeof item === 'object' && (item as XKeys)['x-hidden'])
      )
      .map(stripExtensions)
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !key.startsWith('x-'))
        .map(([key, v]) => [key, stripExtensions(v)])
    )
  }
  return value
}

/** Schema-compliant JSON Resume, without extensions or hidden entries. */
export function toJsonResume(resume: EliResume): JsonResume {
  const stripped = stripExtensions(resume) as JsonResume
  // Drop sections that ended up empty after hiding everything in them.
  return compact(stripped as Record<string, unknown>) as JsonResume
}
