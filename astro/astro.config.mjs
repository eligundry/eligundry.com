import { defineConfig } from 'astro/config'
import preact from '@astrojs/preact'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import turbolinks from '@astrojs/turbolinks'
import partytown from '@astrojs/partytown'
import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
  // Enable the Preact integration to support Preact JSX components.
  integrations: [
    preact(),
    // react(),
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    turbolinks(),
    partytown(),
    sitemap(),
  ],
})
