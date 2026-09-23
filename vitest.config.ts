/// <reference types="vitest" />
import { configDefaults } from 'vitest/config'
import { getViteConfig } from 'astro/config'

// Date helpers work in local time and their tests are written for New York.
process.env.TZ = 'America/New_York'

export default getViteConfig({
  test: {
    // tests/e2e is Playwright's
    exclude: [...configDefaults.exclude, 'tests/**'],
    // Bundle React-based dependencies so Astro's react -> preact/compat alias
    // applies to them, like it does in the browser.
    server: { deps: { inline: ['usewebmcp'] } },
    env: {
      // Modules that import the database client need a URL to load; tests
      // never connect to it.
      SECRET_TURSO_DB_URL:
        process.env.SECRET_TURSO_DB_URL ?? 'http://localhost:8080',
    },
  },
})
