import { test, expect, type Page } from '@playwright/test'

/**
 * Covers what needs a real browser: hydrating the server-rendered resume, the
 * tools working through Chrome's own WebMCP implementation, a tailored link
 * surviving a reload, and print pagination estimates matching Chrome's PDFs.
 * Component behaviour is tested with Testing Library in src/components/Resume.
 *
 * Runs in the `webmcp` Playwright project: Google Chrome with the WebMCP
 * feature enabled.
 */

type ToolResult = { content: { text: string }[]; isError?: boolean }

const TOOLS = [
  'add_item',
  'export_json_resume',
  'get_changes',
  'get_print_layout',
  'get_resume',
  'get_share_url',
  'highlight_keywords',
  'open_print_dialog',
  'reorder',
  'reset_tailoring',
  'revert_change',
  'rewrite',
  'set_job_context',
  'set_print_options',
  'set_skill_keywords',
  'set_summary',
  'set_visibility',
]

async function openResume(page: Page, url = '/resume/') {
  await page.goto(url)
  expect(
    await page.evaluate(() => 'modelContext' in document),
    'this browser has no WebMCP; run the webmcp Playwright project'
  ).toBe(true)
  // Tools register after hydration, and Chrome registers them asynchronously
  await expect
    .poll(() =>
      page.evaluate(
        async () => (await document.modelContext!.getTools()).length
      )
    )
    .toBe(TOOLS.length)
}

/** Calls a tool the way an agent would, through `document.modelContext`. */
async function call(page: Page, name: string, input: unknown = {}) {
  const result = await page.evaluate(
    async ([name, input]) => {
      // executeTool is Chrome's addition to the standard ModelContext
      const modelContext = document.modelContext as NonNullable<
        Document['modelContext']
      > & { executeTool(tool: unknown, input: string): Promise<string> }
      const tool = (await modelContext.getTools()).find((t) => t.name === name)
      if (!tool) throw new Error(`Tool ${name} is not registered`)
      return modelContext.executeTool(tool, JSON.stringify(input))
    },
    [name, input] as const
  )
  const { content, isError } = JSON.parse(result) as ToolResult
  if (isError) throw new Error(content[0].text)
  return JSON.parse(content[0].text)
}

const item = (page: Page, id: string) =>
  page.locator(`[data-resume-root] [data-resume-id="${id}"]`)

test.beforeEach(async ({ page }) => {
  // Keep the dev server's HMR socket out of it: Vite crashes when it relays
  // unrelated server errors (e.g. failed API fetches) to a connected client.
  await page.routeWebSocket(/\/\?token=|vite-hmr/, () => {})
})

test('hydrates the resume without errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error' && /hydrat|preact/i.test(message.text())) {
      errors.push(message.text())
    }
  })

  await page.goto('/resume/')
  await expect(item(page, 'chord:0')).toContainText(
    'Led successful client launches'
  )
  // Astro drops the island's `ssr` attribute once it has hydrated.
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0)
  await page.evaluate(() => {
    window.print = () => document.body.setAttribute('data-printed', '')
  })
  await page.locator('.print-button').click()
  await expect(page.locator('body')).toHaveAttribute('data-printed')
  expect(errors).toEqual([])
})

test('registers every tool with the browser', async ({ page }) => {
  await openResume(page)
  const names = await page.evaluate(async () =>
    (await document.modelContext!.getTools()).map((tool) => tool.name).sort()
  )
  expect(names).toEqual(TOOLS)
  await expect(
    call(page, 'rewrite', { id: 'chord', markdown: 'CTO', reason: 'x' })
  ).rejects.toThrow(/locked/)
})

test('restores a tailored link after a reload', async ({ page }) => {
  await openResume(page)

  await call(page, 'set_visibility', {
    ids: ['talent-inc'],
    visible: false,
    reason: 'Older role',
  })
  await call(page, 'rewrite', {
    id: 'chord:0',
    markdown: 'Shipped a **React SDK**',
    reason: 'Lead with SDKs',
  })
  await call(page, 'highlight_keywords', { terms: ['React'] })
  const { url } = await call(page, 'get_share_url')

  await page.goto('about:blank')
  await openResume(page, url)
  await expect(item(page, 'talent-inc')).toHaveCount(0)
  await expect(item(page, 'chord:0')).toHaveText('Shipped a React SDK')
  expect(
    await page.evaluate(() => CSS.highlights.get('tailor')?.size ?? 0)
  ).toBeGreaterThan(0)
})

test('estimates print pagination that matches the PDF', async ({ page }) => {
  await openResume(page)

  const countPdfPages = async () => {
    await page.emulateMedia({ media: 'print' })
    const pdf = await page.pdf({ preferCSSPageSize: true })
    await page.emulateMedia({ media: 'screen' })
    return (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length
  }

  const layout = await call(page, 'get_print_layout')
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
