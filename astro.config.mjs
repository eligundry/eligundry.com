import { fileURLToPath } from 'node:url'
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

import mdx from '@astrojs/mdx'
import { satteri } from '@astrojs/markdown-satteri'
import markdownConfig from './src/lib/markdown.mjs'
import { codeThemes } from './src/lib/codeThemes'

// https://astro.build/config
import preact from '@astrojs/preact'

// https://astro.build/config
import partytown from '@astrojs/partytown'

// Font optimization
import webfontDownload from 'vite-plugin-webfont-dl'
import { FontaineTransform } from 'fontaine'

// https://astro.build/config
import cloudflare from '@astrojs/cloudflare'

/**
 * Astro renders pages in both the `ssr` and `prerender` Vite environments, and
 * the top level `vite.ssr` options only reach the former, so set them on each.
 * React-based packages must be bundled so the react -> preact/compat alias
 * applies to them.
 *
 * @returns {import('vite').Plugin}
 */
const serverDependencies = () => ({
  name: 'eligundry:server-dependencies',
  enforce: 'pre',
  // Keep Sätteri's native binding out of the Worker bundle: notes are only
  // rendered at build time.
  resolveId(id, importer) {
    if (
      !process.env.VITEST &&
      this.environment?.name === 'ssr' &&
      id === './daylioNotes' &&
      importer?.endsWith('/src/lib/daylio.ts')
    ) {
      return fileURLToPath(
        new URL('./src/lib/daylioNotes/worker.ts', import.meta.url)
      )
    }
  },
  configEnvironment(name) {
    if (name !== 'ssr' && name !== 'prerender') {
      return
    }

    return {
      resolve: {
        // The Cloudflare plugin rejects externals in the Worker ("ssr")
        // environment
        ...(name === 'prerender' ? { external: ['better-sqlite3'] } : {}),
        noExternal: [
          '@astro-community/astro-embed-youtube',
          '@react-hookz/web',
          'chartjs-adapter-date-fns',
          'react-icons',
          // @astrojs/preact only adds these when nothing else sets noExternal
          'react',
          'react-dom',
          'react/jsx-runtime',
        ],
      },
    }
  },
})

// https://astro.build/config
export default defineConfig({
  security: {
    checkOrigin: false,
  },
  // Vitest runs in Node, where the adapter's workerd environments can't load
  adapter: process.env.VITEST
    ? undefined
    : cloudflare({
        // The build leans on Node-only tools (jsdom, sharp, simple-git, node:fs),
        // so prerender in Node rather than workerd.
        prerenderEnvironment: 'node',
        // Optimize images with sharp at build time and serve them as static
        // files
        imageService: 'compile',
      }),
  image: {
    remotePatterns: [{ protocol: 'https' }],
  },
  // Keep the whitespace between inline elements that Astro 7's default
  // 'jsx' mode strips
  compressHTML: true,
  markdown: {
    // MDX inherits this processor and its plugins
    processor: satteri(markdownConfig),
    shikiConfig: {
      themes: codeThemes,
    },
  },
  vite: {
    plugins: [tailwindcss(), serverDependencies()],
    define: {
      // When the site was built, for the build-time meta tag in Layout.astro
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
  },
  integrations: [
    mdx(),
    preact({
      compat: true,
    }),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
    webfontDownload(
      'https://fonts.googleapis.com/css2?family=Arvo:ital,wght@0,400;0,700;1,400;1,700&family=Fira+Code&family=Lato:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&display=fallback'
    ),
    FontaineTransform.vite({
      fallbacks: ['ui-sans-serif', 'Helvetica Neue', 'Arial', 'sans-serif'],
      resolvePath: (id) =>
        new URL(`./public/astro-fontaine${id}`, import.meta.url),
    }),
  ],
})
