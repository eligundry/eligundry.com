import { test, expect } from '@playwright/test'
import {
  chai,
  JestAsymmetricMatchers,
  JestChaiExpect,
  JestExtend,
  type ExpectStatic,
} from '@vitest/expect'
import { jsonResumeSchema } from '../../src/lib/resume/__fixtures__/jsonResumeSchema'

// Vitest's expect, standalone, for its Standard Schema matcher.
chai.use(JestExtend)
chai.use(JestChaiExpect)
chai.use(JestAsymmetricMatchers)
const vitestExpect = chai.expect as unknown as ExpectStatic

test.describe('/resume.json', () => {
  test('is valid JSON Resume', async ({ request }) => {
    const response = await request.get('/resume.json')
    expect(response.ok()).toBe(true)
    const resume = await response.json()

    vitestExpect(resume).toEqual(vitestExpect.schemaMatching(jsonResumeSchema))
    expect(resume.work[0]).toMatchObject({
      name: 'Code Climate',
      position: 'Senior Product Engineer',
      startDate: '2025-03-31',
    })
  })
})

test.describe('/resume/', () => {
  test('shows promotions on one line, dated in superscript', async ({
    page,
  }) => {
    await page.goto('/resume/')
    const titles = page.locator('[data-print-unit="code-climate"] h4')
    await expect(titles).toHaveText(
      'Senior Product EngineerMar 2026–Present, Product EngineerMar 2025–Mar 2026'
    )
    await expect(titles.locator('sup')).toHaveCount(2)
  })
})
