import { defineConfig, devices } from '@playwright/test'

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:4321'
const isLocal = baseURL.startsWith('http://localhost')

// Allow pointing at a pre-installed Chromium (e.g. a CI/container image that
// ships its own browser) instead of Playwright's managed download.
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined

// The resume's WebMCP tools are tested against Chrome's own WebMCP
// implementation, which needs a recent Chrome (tested with 154) with the
// WebMCP feature on. By default that's the installed Google Chrome
// (`playwright install chrome`); PLAYWRIGHT_WEBMCP_CHROME_PATH points at
// another build, e.g. Chrome for Testing.
const webmcpChromePath = process.env.PLAYWRIGHT_WEBMCP_CHROME_PATH || undefined
const webmcpSpecs = /resume-tailor\.spec\.ts/

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  // The @visual screenshot suite has environment-specific baselines (browser
  // build + font rendering), so skip it in CI and run it locally instead.
  grepInvert: process.env.CI ? /@visual/ : undefined,
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: webmcpSpecs,
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: executablePath ? { executablePath } : {},
      },
    },
    {
      name: 'webmcp',
      testMatch: webmcpSpecs,
      use: {
        ...devices['Desktop Chrome'],
        ...(webmcpChromePath ? {} : { channel: 'chrome' }),
        launchOptions: {
          executablePath: webmcpChromePath,
          args: ['--enable-features=WebMCP'],
        },
      },
    },
  ],
  webServer: isLocal
    ? {
        command: 'pnpm dev',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
})
