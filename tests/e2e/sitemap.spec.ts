import { test, expect, request } from '@playwright/test'
import { JSDOM } from 'jsdom'

const SITEMAP_HOSTNAME = 'https://eligundry.com'
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:4321'

async function getSitemapUrls(): Promise<string[]> {
  const ctx = await request.newContext()
  const res = await ctx.get(`${baseURL}/sitemap.xml`)
  if (!res.ok()) {
    throw new Error(`sitemap.xml returned ${res.status()}`)
  }
  const xml = await res.text()
  await ctx.dispose()

  const dom = new JSDOM(xml, { contentType: 'text/xml' })
  const urls = Array.from(dom.window.document.querySelectorAll('url > loc'))
    .map((el) => el.textContent?.trim() ?? '')
    .filter(Boolean)
    .map((url) => url.replace(SITEMAP_HOSTNAME, ''))

  if (urls.length === 0) {
    throw new Error('sitemap is empty')
  }
  return urls
}

const urls = await getSitemapUrls()

test.describe('sitemap', () => {
  for (const url of urls) {
    test(`${url} loads without redirects and has main content`, async ({
      page,
    }) => {
      const response = await page.goto(url, { waitUntil: 'domcontentloaded' })
      expect(response, 'no response').not.toBeNull()
      expect(response!.status(), 'expected 200').toBe(200)
      expect(
        response!.request().redirectedFrom(),
        'expected no redirect'
      ).toBeNull()

      const main = page.locator('main')
      await expect(main, 'expected exactly one <main>').toHaveCount(1)
      const text = (await main.innerText()).trim()
      expect(text.length, '<main> is empty').toBeGreaterThan(0)
    })
  }
})
