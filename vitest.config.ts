/// <reference types="vitest/config" />
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
    server: { deps: { inline: ['usewebmcp', 'react-icons'] } },
  },
})
