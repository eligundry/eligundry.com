import { test, expect, request } from '@playwright/test'

const SITEMAP_HOSTNAME = 'https://eligundry.com'

async function getSitemapUrls(baseURL: string): Promise<string[]> {
  const ctx = await request.newContext()
  const res = await ctx.get(`${baseURL}/sitemap.xml`)
  expect(res.ok(), `sitemap.xml returned ${res.status()}`).toBeTruthy()
  const xml = await res.text()
  await ctx.dispose()

  const urls = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) =>
    m[1].replace(SITEMAP_HOSTNAME, '')
  )
  expect(urls.length, 'sitemap should not be empty').toBeGreaterThan(0)
  return urls
}

test('sitemap pages load without redirects and have main content', async ({
  page,
  baseURL,
}) => {
  test.slow()
  const urls = await getSitemapUrls(baseURL!)
  const failures: string[] = []

  for (const url of urls) {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded' })
    if (!response) {
      failures.push(`${url}: no response`)
      continue
    }

    const status = response.status()
    if (status !== 200) {
      failures.push(`${url}: status ${status}`)
      continue
    }

    if (response.request().redirectedFrom()) {
      failures.push(`${url}: was redirected`)
      continue
    }

    const main = page.locator('main')
    const count = await main.count()
    if (count !== 1) {
      failures.push(`${url}: expected 1 <main>, found ${count}`)
      continue
    }

    const text = (await main.innerText()).trim()
    if (text.length === 0) {
      failures.push(`${url}: <main> is empty`)
    }
  }

  expect(failures, failures.join('\n')).toEqual([])
})
