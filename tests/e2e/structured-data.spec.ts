import { test, expect, type Page } from '@playwright/test'
import { encodeState } from '../../src/lib/resumeTailor/serialize'
import { HASH_KEY } from '../../src/lib/resumeTailor/hash'
import {
  extractMicrodata,
  loadVocabulary,
  validateMicrodata,
  type MicrodataItem,
  type MicrodataValue,
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

const items = (values: MicrodataValue[] = []) =>
  values.flatMap((v) => (v.kind === 'item' ? [v.item] : []))

const prop = (item: MicrodataItem, name: string) =>
  (item.properties[name] ?? []).map((v) =>
    v.kind === 'item' ? undefined : v.value
  )

async function person(page: Page) {
  const microdata = await extractMicrodata(page)
  expect(await validateMicrodata(microdata, vocabulary)).toEqual([])
  const people = microdata.filter((item) =>
    item.types.includes('https://schema.org/Person')
  )
  expect(people).toHaveLength(1)
  return people[0]
}

function expectStructuredPerson(eli: MicrodataItem) {
  // Every skill is a named Thing, not bare text or a URL
  const knowsAbout = eli.properties.knowsAbout ?? []
  expect(knowsAbout.length).toBeGreaterThan(10)
  for (const value of knowsAbout) {
    expect(value.kind).toBe('item')
    const thing = (value as Extract<MicrodataValue, { kind: 'item' }>).item
    expect(thing.types).toEqual(['https://schema.org/Thing'])
    expect(prop(thing, 'name')[0]).toBeTruthy()
  }

  expect(prop(eli, 'email')).toEqual(['eligundry@gmail.com'])
  expect(prop(eli, 'award')).toContain(
    'Eagle Scout, Boy Scouts of America, 2006'
  )

  const [eagleScout] = items(eli.properties.hasCredential)
  expect(eagleScout).toMatchObject({
    types: ['https://schema.org/EducationalOccupationalCredential'],
  })
  expect(prop(eagleScout, 'name')).toEqual(['Eagle Scout'])

  // Each job's current role carries its accomplishments
  const jobs = items(eli.properties.worksFor).concat(
    items(eli.properties.alumniOf)
  )
  const roles = jobs.flatMap((job) => items(job.properties.member))
  expect(
    roles.filter((role) => prop(role, 'description').length).length
  ).toBeGreaterThan(5)
  expect(prop(items(eagleScout.properties.recognizedBy)[0], 'name')).toEqual([
    'Boy Scouts of America',
  ])
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

  expectStructuredPerson(await person(page))
  await expect(
    page.locator(
      '[data-resume-id="activities:eagle-scout"] [itemprop="knowsAbout"][itemscope] [itemprop="name"]'
    )
  ).toHaveText('TypeScript')
})
