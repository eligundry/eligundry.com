import { test, expect, request } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { JSDOM } from 'jsdom'
import { loadVocabulary, validateMicrodata } from './schemaOrg'

const SITEMAP_HOSTNAME = 'https://eligundry.com'
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:4321'

const COLOR_SCHEMES = ['light', 'dark'] as const
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

// Known failures, skipped so the rest of the checks can guard against new
// ones. Remove an entry once it's fixed.
//
// Site-wide: the brand blue (#088cde) is under 4.5:1 on the light theme's
// white and grey backgrounds, the material-theme-lighter code highlighting
// fails on both themes, and footer links in dark mode are told apart from the
// surrounding text by colour alone. All three need palette decisions.
const KNOWN_VIOLATIONS = ['color-contrast', 'link-in-text-block']
// Per page: content that lives outside this repo.
const KNOWN_PAGE_VIOLATIONS: Record<string, string[]> = {
  // The photo comes from Notion with no caption to use as alt text.
  '/blog/links/changes-2k26/': ['image-alt'],
}

type AxeViolation = Awaited<
  ReturnType<AxeBuilder['analyze']>
>['violations'][number]

// Third-party embeds (Spotify, Bandcamp, Twitter, Utterances) aren't ours to
// fix, so drop results from inside iframes. Axe reports those with one
// selector per frame, so they're the targets longer than one. The <iframe>
// elements themselves (e.g. their titles) are still checked.
function withoutFrameContents(violations: AxeViolation[]) {
  return violations
    .map((v) => ({ ...v, nodes: v.nodes.filter((n) => n.target.length === 1) }))
    .filter((v) => v.nodes.length > 0)
}

// Keep failures readable: the rule, why it matters, and where it fired.
function formatViolation(v: AxeViolation) {
  return {
    rule: v.id,
    impact: v.impact,
    help: `${v.help} (${v.helpUrl})`,
    nodes: v.nodes.map((n) => n.target.join(' ')),
  }
}

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
const vocabulary = await loadVocabulary()

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

    test(`${url} passes schema.org validation`, async ({ page }) => {
      await page.goto(url, { waitUntil: 'domcontentloaded' })
      expect(await validateMicrodata(page, vocabulary)).toEqual([])
    })

    for (const colorScheme of COLOR_SCHEMES) {
      test(`${url} has no accessibility violations in ${colorScheme} mode`, async ({
        page,
      }) => {
        // Axe takes a while on the longer pages (feelings, playlists).
        test.setTimeout(90_000)

        // With no saved preference, the inline script in Layout.astro picks the
        // theme from prefers-color-scheme, the same path a first-time visitor
        // takes. Hand-made static pages skip Layout.astro and style themselves
        // with the media query directly.
        await page.emulateMedia({ colorScheme })
        await page.goto(url, { waitUntil: 'domcontentloaded' })
        const theme = await page.locator('html').getAttribute('data-theme')
        if (theme !== null) {
          expect(theme, 'page rendered in the wrong theme').toBe(colorScheme)
        }
        await page
          .waitForLoadState('networkidle', { timeout: 5000 })
          .catch(() => {})

        const { violations } = await new AxeBuilder({ page })
          .withTags(AXE_TAGS)
          .disableRules([
            ...KNOWN_VIOLATIONS,
            ...(KNOWN_PAGE_VIOLATIONS[url] ?? []),
          ])
          .analyze()

        expect(withoutFrameContents(violations).map(formatViolation)).toEqual(
          []
        )
      })
    }
  }
})
