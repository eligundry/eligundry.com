import { test, expect, type Page } from '@playwright/test'

/**
 * Visual-regression suite guarding the site's styling.
 *
 * Baselines were generated in the project's Linux/Chromium container; run the
 * suite in a matching environment (or regenerate with `--update-snapshots`).
 *
 * Non-deterministic regions are neutralised so diffs only reflect real styling
 * changes: the Houdini "fluid pattern" background is hidden, animations are
 * disabled, and canvases (Daylio chart) + iframes (Spotify/streaming embeds)
 * are masked. Lazy-loaded images are forced in via a full scroll pass.
 */

type PageSpec = {
  name: string
  path: string
  // Extra CSS selectors to mask, beyond the always-masked canvas/iframe, to
  // cover non-deterministic content on that page.
  extraMask?: string[]
}

const PAGES: PageSpec[] = [
  // The Memoji cycles to a random image every 2s; mask it.
  { name: 'home', path: '/', extraMask: ['#memoji-wrapper'] },
  { name: 'resume', path: '/resume' },
  { name: 'blog', path: '/blog' },
  { name: 'talks', path: '/talks' },
  // Feelings entries embed animated GIFs that never settle; mask all images.
  { name: 'feelings', path: '/feelings', extraMask: ['img'] },
  { name: 'seasonal-playlists', path: '/seasonal-playlists' },
  { name: 'blog-post', path: '/blog/neovim-lua' },
]

const THEMES = ['light', 'dark'] as const

async function autoScroll(page: Page) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let total = 0
      const step = 400
      const timer = setInterval(() => {
        window.scrollBy(0, step)
        total += step
        if (total >= document.body.scrollHeight) {
          clearInterval(timer)
          window.scrollTo(0, 0)
          resolve()
        }
      }, 40)
    })
  })
}

for (const theme of THEMES) {
  for (const p of PAGES) {
    test(`${p.name} — ${theme}`, async ({ page }) => {
      // Some pages embed slow/hanging external resources (Last.fm, Spotify), so
      // give navigation + settling room beyond the 30s default.
      test.setTimeout(90_000)

      // Block Vite's HMR websocket: leaving the handler empty means the browser
      // never connects upstream, which stops the dev server crashing on the
      // upgrade. HMR is irrelevant to a static screenshot.
      await page.routeWebSocket(/.*/, () => {})

      // The inline script in Layout.astro reads localStorage.theme on load.
      await page.addInitScript((t) => {
        window.localStorage.setItem('theme', t)
      }, theme)

      // domcontentloaded (not "load") so hanging external images/iframes don't
      // stall navigation; we settle explicitly below.
      await page.goto(p.path, { waitUntil: 'domcontentloaded' })

      // Neutralise motion and the non-deterministic paint-worklet background.
      await page.addStyleTag({
        content: `
          .fancy-bg, #fancy-background-canvas { display: none !important; }
          *, *::before, *::after {
            animation: none !important;
            transition: none !important;
            caret-color: transparent !important;
          }
        `,
      })

      await autoScroll(page)
      await page.evaluate(() => document.fonts.ready)
      // Bounded settle: let in-viewport resources arrive without waiting on any
      // hanging external request forever.
      await page.waitForLoadState('networkidle', { timeout: 6000 }).catch(() => {})
      await page.waitForTimeout(1000)

      const mask = [page.locator('canvas'), page.locator('iframe')]
      for (const selector of p.extraMask ?? []) {
        mask.push(page.locator(selector))
      }

      await expect(page).toHaveScreenshot(`${p.name}-${theme}.png`, {
        fullPage: true,
        animations: 'disabled',
        mask,
        maxDiffPixelRatio: 0.01,
        timeout: 15_000,
      })
    })
  }
}
