import { test, expect, type Page } from '@playwright/test'

/**
 * Drives the /resume/ WebMCP tools the way an in-browser agent would. Browsers
 * don't ship WebMCP by default yet, so a minimal `navigator.modelContext` shim
 * captures the registered tools.
 */

declare global {
  interface Window {
    __tools: Record<
      string,
      {
        execute: (
          input: unknown
        ) => Promise<{ content: { text: string }[]; isError?: boolean }>
      }
    >
  }
}

test.beforeEach(async ({ page }) => {
  // Keep the dev server's HMR socket out of it: Vite crashes when it relays
  // unrelated server errors (e.g. failed API fetches) to a connected client.
  await page.routeWebSocket(/\/\?token=|vite-hmr/, () => {})
  await page.addInitScript(() => {
    window.__tools = {}
    Object.defineProperty(navigator, 'modelContext', {
      value: {
        registerTool: (tool: { name: string }) => {
          // @ts-expect-error - shim
          window.__tools[tool.name] = tool
        },
      },
    })
  })
})

async function openResume(page: Page, url = '/resume/') {
  await page.goto(url)
  await page.waitForFunction(() => Boolean(window.__resumeTailor))
}

async function call(page: Page, name: string, input: unknown = {}) {
  const result = await page.evaluate(
    async ([name, input]) => window.__tools[name as string].execute(input),
    [name, input] as const
  )
  const text = result.content[0].text
  if (result.isError) {
    throw new Error(text)
  }
  return JSON.parse(text)
}

const section = (page: Page, id: string) =>
  page.locator(`[data-resume-root] [data-resume-id="${id}"]`)

test('registers the tailoring tools', async ({ page }) => {
  await openResume(page)
  const names = await page.evaluate(() => Object.keys(window.__tools))
  expect(names).toEqual(
    expect.arrayContaining([
      'get_resume',
      'export_json_resume',
      'set_visibility',
      'reorder',
      'rewrite',
      'add_item',
      'set_skill_keywords',
      'get_print_layout',
      'set_print_options',
    ])
  )
  const { resume } = await call(page, 'get_resume')
  expect(resume.work.map((w: { 'x-id': string }) => w['x-id'])).toContain(
    'chord'
  )
  await expect(page.getByText('This resume supports')).toBeVisible()
})

test('tailors the page, tracks changes and survives a reload', async ({
  page,
}) => {
  await openResume(page)

  await call(page, 'set_job_context', {
    company: 'Acme',
    title: 'Staff Engineer',
  })
  await call(page, 'set_visibility', {
    ids: ['talent-inc'],
    visible: false,
    reason: 'Older role',
  })
  await call(page, 'rewrite', {
    id: 'chord:0',
    markdown: 'Shipped a **React SDK** used by every client',
    reason: 'Lead with SDK work',
  })
  await call(page, 'reorder', {
    container: 'sections',
    ids: ['section:skills'],
    reason: 'Skills first',
  })
  const added = await call(page, 'add_item', {
    parentId: 'chord',
    markdown: 'Mentored engineers',
    reason: 'Posting values mentorship',
  })
  await call(page, 'set_skill_keywords', {
    id: 'skills:languages',
    keywords: ['TypeScript', 'Go'],
    reason: 'What the posting uses',
  })

  await expect(section(page, 'talent-inc')).toBeHidden()
  await expect(section(page, 'chord:0')).toContainText(
    'Shipped a React SDK used by every client'
  )
  await expect(section(page, 'chord:0').locator('strong')).toHaveText(
    'React SDK'
  )
  await expect(section(page, added.id)).toHaveText('Mentored engineers')
  // The original is kept (hidden) for review mode, so compare rendered text.
  await expect(section(page, 'skills:languages')).toHaveText(
    'Fluent in TypeScript and Go.',
    { useInnerText: true }
  )
  const firstSection = await page
    .locator('[data-resume-container="sections"] > [data-resume-id]')
    .first()
    .getAttribute('data-resume-id')
  expect(firstSection).toBe('section:skills')
  await expect(page).toHaveTitle(/Acme Staff Engineer/)
  await expect(
    page.getByText('Tailored for Staff Engineer at Acme')
  ).toBeVisible()

  const exported = await call(page, 'export_json_resume')
  expect(exported.work.map((w: { name: string }) => w.name)).not.toContain(
    'Talent Inc.'
  )
  expect(exported.skills[0].keywords).toEqual(['TypeScript', 'Go'])

  // Review mode shows the original next to the rewrite
  await page.getByLabel('Show changes on the page').check()
  await expect(section(page, 'chord:0').locator('del')).toContainText(
    'Led successful client launches'
  )
  await expect(section(page, 'talent-inc')).toBeVisible()

  // The whole tailoring lives in the URL
  const { url } = await call(page, 'get_share_url')
  expect(url).toMatch(/#t=/)
  await page.goto('about:blank')
  await openResume(page, url)
  await expect(section(page, 'talent-inc')).toBeHidden()
  await expect(section(page, 'chord:0')).toContainText('Shipped a React SDK')

  // Reverting one change leaves the others
  const changes = await call(page, 'get_changes')
  const hide = changes.find(
    (c: { op: { type: string } }) => c.op.type === 'setVisibility'
  )
  await call(page, 'revert_change', { changeId: hide.id })
  await expect(section(page, 'talent-inc')).toBeVisible()
  await expect(section(page, 'chord:0')).toContainText('Shipped a React SDK')

  await call(page, 'reset_tailoring')
  await expect(section(page, 'chord:0')).toContainText(
    'Led successful client launches'
  )
  await expect(section(page, added.id)).toHaveCount(0)
  expect(page.url()).not.toContain('#t=')
})

test('rejects invalid changes and escapes HTML', async ({ page }) => {
  await openResume(page)

  await expect(
    call(page, 'rewrite', { id: 'chord', markdown: 'CTO', reason: 'x' })
  ).rejects.toThrow(/locked/)
  await expect(
    call(page, 'set_visibility', { ids: ['nope'], visible: false, reason: 'x' })
  ).rejects.toThrow(/Unknown id/)

  await call(page, 'rewrite', {
    id: 'chord:1',
    markdown: '<img src=x onerror="window.pwned=1"> [x](javascript:alert(1))',
    reason: 'x',
  })
  await expect(section(page, 'chord:1').locator('ins')).toContainText(
    '<img src=x'
  )
  await expect(section(page, 'chord:1').locator('ins img, ins a')).toHaveCount(
    0
  )
  expect(await page.evaluate(() => 'pwned' in window)).toBe(false)
})

test('estimates print pagination and fixes breaks', async ({ page }) => {
  await openResume(page)

  const countPdfPages = async () => {
    await page.emulateMedia({ media: 'print' })
    const pdf = await page.pdf({ preferCSSPageSize: true })
    await page.emulateMedia({ media: 'screen' })
    return (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length
  }

  const layout = await call(page, 'get_print_layout')
  expect(layout.pageCount).toBeGreaterThanOrEqual(1)
  expect(layout.pageCount).toBe(await countPdfPages())

  const { layout: broken } = await call(page, 'set_print_options', {
    breakBefore: ['section:education'],
    reason: 'Start education on a fresh page',
  })
  const educationPage = broken.pages.find((p: { ids: string[] }) =>
    p.ids.includes('section:education:title')
  )
  expect(educationPage.ids[0]).toBe('section:education:title')
  expect(broken.pageCount).toBe(await countPdfPages())
})
