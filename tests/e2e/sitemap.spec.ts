import { globSync } from 'node:fs'
import { test, expect, request } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { JSDOM } from 'jsdom'
import { loadVocabulary, validateMicrodata } from './schemaOrg'

const SITEMAP_HOSTNAME = 'https://eligundry.com'
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:4321'

const COLOR_SCHEMES = ['light', 'dark'] as const
// A small phone, a typical phone, a tablet and a laptop
const VIEWPORT_WIDTHS = [320, 375, 768, 1280]

// Hand-made static pages (src/pages/**/*.html) are left out of the
// sideways-scroll check. Their URLs are derived the same way as in
// sitemap.xml.ts.
const HTML_PAGE_URLS = new Set(
  globSync('**/*.html', { cwd: 'src/pages' }).map((file) =>
    `/${file}`.replace(/\/index\.html$/, '/').replace(/\.html$/, '/')
  )
)

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

// Known failures, skipped per page so the rest of the checks still run. Remove
// an entry once it's fixed.
const KNOWN_PAGE_VIOLATIONS: Record<string, string[]> = {
  // The photo's alt text is set in Notion, but Notion's API doesn't return
  // image alt text, so it can't reach the page.
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

// Elements that stick out past the right edge of the page while their parent
// doesn't, which are where horizontal overflow starts. Content inside a
// scrolling or clipping box (like a code block) is left out, since it doesn't
// widen the page. Pseudo-elements (like tooltips) can't be selected.
function overflowingElements() {
  const width = document.documentElement.clientWidth
  const overflows = (el: Element | null) =>
    !!el && el.getBoundingClientRect().right > width + 0.5
  const clipped = (el: Element) => {
    for (
      let a = el.parentElement;
      a && a !== document.body;
      a = a.parentElement
    ) {
      if (getComputedStyle(a).overflowX !== 'visible') return true
    }
    return false
  }
  return Array.from(document.body.querySelectorAll('*'))
    .filter((el) => overflows(el) && !overflows(el.parentElement))
    .filter((el) => !clipped(el))
    .map((el) => {
      const classes = Array.from(el.classList).slice(0, 4).join('.')
      return `<${el.tagName.toLowerCase()}${classes ? `.${classes}` : ''}> ends at ${Math.round(el.getBoundingClientRect().right)}px`
    })
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
    // These only read the page, so they share one page load. Each is a step
    // with soft assertions, so one failing doesn't hide the others.
    test(`${url} loads, validates and doesn't scroll sideways`, async ({
      page,
    }) => {
      // Three checks' worth of work, and the longer pages are slow to render
      test.setTimeout(60_000)
      const response = await page.goto(url, { waitUntil: 'domcontentloaded' })

      await test.step('loads without redirects and has main content', async () => {
        expect(response, 'no response').not.toBeNull()
        expect.soft(response!.status(), 'expected 200').toBe(200)
        expect
          .soft(response!.request().redirectedFrom(), 'expected no redirect')
          .toBeNull()

        const main = page.locator('main')
        await expect.soft(main, 'expected exactly one <main>').toHaveCount(1)
        const text = (await main.first().innerText()).trim()
        expect.soft(text.length, '<main> is empty').toBeGreaterThan(0)
      })

      await test.step('passes schema.org validation', async () => {
        expect.soft(await validateMicrodata(page, vocabulary)).toEqual([])
      })

      // Hand-made static pages are art pieces with their own layouts
      if (HTML_PAGE_URLS.has(url)) {
        return
      }

      await test.step("doesn't scroll sideways", async () => {
        await page
          .waitForLoadState('networkidle', { timeout: 5000 })
          .catch(() => {})

        for (const width of VIEWPORT_WIDTHS) {
          await page.setViewportSize({ width, height: 800 })
          const { scrollWidth, clientWidth } = await page.evaluate(() => ({
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
          }))
          const culprits =
            scrollWidth > clientWidth
              ? (await page.evaluate(overflowingElements)).join(', ') ||
                'nothing sticks out, so likely a pseudo-element'
              : ''
          expect
            .soft(scrollWidth, `${clientWidth}px wide viewport: ${culprits}`)
            .toBeLessThanOrEqual(clientWidth)
        }
      })
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
          .disableRules(KNOWN_PAGE_VIOLATIONS[url] ?? [])
          .analyze()

        expect(withoutFrameContents(violations).map(formatViolation)).toEqual(
          []
        )
      })
    }
  }
})
