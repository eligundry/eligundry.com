import { test, expect, type Page } from '@playwright/test'
import { encodeState } from '../../src/lib/resumeTailor/serialize'
import { HASH_KEY } from '../../src/lib/resumeTailor/hash'
import {
  extractMicrodata,
  loadVocabulary,
  validateMicrodata,
  type Json,
} from './schemaOrg'

/**
 * The resume's schema.org microdata must pass schema.org validation, both as
 * published and after an agent tailors it, since tailored text is rendered
 * with the same technology markup.
 */

let vocabulary: Awaited<ReturnType<typeof loadVocabulary>>

test.beforeAll(async () => {
  vocabulary = await loadVocabulary()
})

test.beforeEach(async ({ page }) => {
  // Keep the dev server's HMR socket out of it (see resume-tailor.spec.ts)
  await page.routeWebSocket(/\/\?token=|vite-hmr/, () => {})
})

/** A property's values, which the extractor gives bare when there's one. */
const all = (value: unknown) => ([] as unknown[]).concat(value ?? [])
const items = (value: unknown) => all(value) as Json[]

async function person(page: Page) {
  expect(await validateMicrodata(page, vocabulary)).toEqual([])
  const people = (await extractMicrodata(page)).Person ?? []
  expect(people).toHaveLength(1)
  return people[0]
}

function expectStructuredPerson(eli: Json) {
  // Every skill is a named Thing, not bare text or a URL
  const knowsAbout = items(eli.knowsAbout)
  expect(knowsAbout.length).toBeGreaterThan(10)
  for (const thing of knowsAbout) {
    expect(thing['@type']).toBe('Thing')
    expect(thing.name).toBeTruthy()
  }

  expect(eli.email).toBe('eligundry@gmail.com')
  expect(all(eli.award)).toContain('Eagle Scout, Boy Scouts of America, 2006')

  expect(items(eli.hasCredential)[0]).toMatchObject({
    '@type': 'EducationalOccupationalCredential',
    name: 'Eagle Scout',
    recognizedBy: { '@type': 'Organization', name: 'Boy Scouts of America' },
  })

  // Each job's current role carries its accomplishments
  const roles = [...items(eli.worksFor), ...items(eli.alumniOf)].flatMap(
    (job) => items(job.member)
  )
  expect(roles.filter((role) => role.description).length).toBeGreaterThan(5)
}

test('the resume passes schema.org validation', async ({ page }) => {
  await page.goto('/resume/')
  expectStructuredPerson(await person(page))
})

test('a tailored resume keeps its schema.org markup', async ({ page }) => {
  const markdown =
    'Became an Eagle Scout in 2006, long before writing [TypeScript](https://www.typescriptlang.org/).'
  const encoded = await encodeState({
    v: 1,
    changes: [
      {
        id: 'structured-data',
        op: { type: 'rewrite', id: 'activities:eagle-scout', markdown },
        reason: 'Checking tailored text keeps its microdata',
        at: new Date().toISOString(),
      },
    ],
  })
  await page.goto(`/resume/#${HASH_KEY}=${encoded}`)
  await expect(
    page.locator('[data-resume-id="activities:eagle-scout"]')
  ).toContainText('long before writing TypeScript')

  const eli = await person(page)
  expectStructuredPerson(eli)
  expect(items(eli.knowsAbout).map((thing) => thing.name)).toContain(
    'TypeScript'
  )
  await expect(
    page.locator(
      '[data-resume-id="activities:eagle-scout"] [itemprop="knowsAbout"][itemscope] [itemprop="name"]'
    )
  ).toHaveText('TypeScript')
})
