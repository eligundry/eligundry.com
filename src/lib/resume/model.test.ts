import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, test } from 'vitest'
// @ts-expect-error - untyped CommonJS module
import { validate } from '@jsonresume/schema'
import { fixtureSource } from './__fixtures__/source'
import {
  editableMarkdown,
  markTechnologies,
  normalizeRoles,
  parseExperienceBody,
  toJsonResume,
  toSuperset,
  type ExperienceNode,
  type JsonResume,
} from './model'

const experiencesDir = path.resolve(
  __dirname,
  '../../content/resumeExperiences'
)

function readBody(slug: string): string {
  const file = fs.readFileSync(path.join(experiencesDir, `${slug}.mdx`), 'utf8')
  return file.replace(/^---\n[\s\S]*?\n---\n/, '')
}

function validateResume(resume: JsonResume): unknown[] | null {
  let errors: unknown[] | null = null
  validate(resume, (err: unknown[] | null) => {
    errors = err
  })
  return errors
}

function collectKeys(value: unknown, keys = new Set<string>()): Set<string> {
  if (Array.isArray(value)) value.forEach((v) => collectKeys(v, keys))
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      keys.add(k)
      collectKeys(v, keys)
    }
  }
  return keys
}

describe('parseExperienceBody', () => {
  test('splits list items into highlights with stable ids', () => {
    const { summary, highlights } = parseExperienceBody(
      'chord',
      readBody('chord')
    )
    expect(summary).toBeUndefined()
    expect(highlights.map((h) => h.id)).toEqual([
      'chord:0',
      'chord:1',
      'chord:2',
    ])
    expect(highlights[0].markdown).toMatch(
      /^Led successful client launches .*\[React SDK\]\(https:\/\/docs\.chord\.co/
    )
  })

  test('keeps inline HTML and joins wrapped lines', () => {
    const { highlights } = parseExperienceBody(
      'talent-inc',
      readBody('talent-inc')
    )
    expect(highlights).toHaveLength(5)
    expect(highlights[1].markdown).toContain(
      '<abbr title="Net Promoter Score">NPS</abbr>'
    )
    expect(highlights[0].markdown).not.toMatch(/\n\s/)
  })

  test('treats paragraphs as the summary', () => {
    const { summary, highlights } = parseExperienceBody(
      'kent-state-university',
      readBody('kent-state-university')
    )
    expect(highlights).toEqual([])
    expect(summary?.id).toBe('kent-state-university:summary')
    expect(summary?.markdown).toMatch(/^Studied computer science/)
  })

  test('parses every experience file', () => {
    for (const file of fs.readdirSync(experiencesDir)) {
      const slug = file.replace(/\.mdx$/, '')
      const { summary, highlights } = parseExperienceBody(slug, readBody(slug))
      expect(summary || highlights.length, slug).toBeTruthy()
    }
  })
})

describe('promotions', () => {
  test('sorts roles newest first, ending each when the next begins', () => {
    expect(
      normalizeRoles([
        { title: 'Product Engineer', startDate: '2025-03-31' },
        { title: 'Senior Product Engineer', startDate: '2026-03-01' },
      ])
    ).toEqual([
      { title: 'Senior Product Engineer', startDate: '2026-03-01' },
      {
        title: 'Product Engineer',
        startDate: '2025-03-31',
        endDate: '2026-03-01',
      },
    ])
  })

  test('keeps explicit end dates', () => {
    expect(
      normalizeRoles([
        { title: 'B', startDate: '2024-01-01', endDate: '2024-06-01' },
        { title: 'A', startDate: '2020-01-01', endDate: '2021-01-01' },
      ]).map((role) => role.endDate)
    ).toEqual(['2024-06-01', '2021-01-01'])
  })

  test('a promotion is its own JSON Resume work entry', () => {
    const source = fixtureSource()
    const chord = source.sections[0].items[0] as ExperienceNode
    chord.position = 'Staff Software Engineer'
    chord.roles = normalizeRoles([
      {
        title: 'Staff Software Engineer',
        startDate: '2023-01-01',
        endDate: '2023-11-27',
      },
      { title: 'Senior Software Engineer', startDate: '2022-02-07' },
    ])
    const resume = toJsonResume(toSuperset(source))
    expect(validateResume(resume)).toBeNull()
    expect(resume.work?.slice(0, 2)).toEqual([
      expect.objectContaining({
        name: 'Chord Commerce',
        position: 'Staff Software Engineer',
        startDate: '2023-01-01',
        endDate: '2023-11-27',
        highlights: ['Built a React SDK.', 'Wrote docs & more.'],
      }),
      {
        name: 'Chord Commerce',
        url: 'https://chord.co',
        location: 'New York, NY',
        position: 'Senior Software Engineer',
        startDate: '2022-02-07',
        endDate: '2023-01-01',
      },
    ])
  })
})

describe('technologies', () => {
  test('marks links to technologies in build-time text', () => {
    const source = markTechnologies(fixtureSource(), [
      { name: 'React SDK', url: 'https://x.dev' },
    ])
    expect(
      (source.sections[0].items[0] as ExperienceNode).highlights[0].html
    ).toBe(
      'Built a <a href="https://x.dev" itemprop="knowsAbout">React SDK</a>.'
    )
    expect(toSuperset(source)['x-technologies']).toEqual([
      { name: 'React SDK', url: 'https://x.dev' },
    ])
  })

  test('editable text is edited as markdown', () => {
    const source = fixtureSource()
    expect(editableMarkdown(source, 'chord:0')).toBe(
      'Built a [React SDK](https://x.dev).'
    )
    expect(editableMarkdown(source, 'skills:frameworks')).toBe(
      'Built apps using React.'
    )
    expect(editableMarkdown(source, 'section:work:title')).toBe('Work')
    expect(editableMarkdown(source, 'chord')).toBeUndefined()
  })
})

describe('JSON Resume', () => {
  test('the superset carries ids and markdown', () => {
    const resume = toSuperset(fixtureSource())
    expect(resume.work?.[0]).toMatchObject({
      name: 'Chord Commerce',
      'x-id': 'chord',
      highlights: ['Built a React SDK.', 'Wrote docs & more.'],
    })
    expect(resume['x-sections']).toHaveLength(4)
  })

  test('exports schema-valid JSON Resume without extensions', () => {
    const resume = toJsonResume(
      toSuperset(fixtureSource(), { version: 'v1.0.0' })
    )
    expect(validateResume(resume)).toBeNull()
    expect([...collectKeys(resume)].filter((k) => k.startsWith('x-'))).toEqual(
      []
    )
    expect(resume.education?.[0]).toMatchObject({
      institution: 'Kent State University',
      area: 'Computer Science',
      studyType: 'Coursework Towards BS',
    })
    expect(resume.skills?.[0]).toEqual({
      name: 'Languages',
      level: 'Fluent',
      keywords: ['TypeScript', 'Go', 'PHP'],
    })
    expect(resume.projects).toHaveLength(1)
    expect(resume.publications).toHaveLength(1)
    expect(resume.awards).toHaveLength(1)
  })

  test('hidden content is left out of the export', () => {
    const source = fixtureSource()
    source.sections[0].items[0].hidden = true
    source.sections[2].hidden = true
    const resume = toJsonResume(toSuperset(source))
    expect(resume.work?.map((w) => w.name)).toEqual(['RadioShack'])
    expect(resume.skills).toBeUndefined()
    expect(validateResume(resume)).toBeNull()
  })
})
