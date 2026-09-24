import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

import mdx from '@astrojs/mdx'
import { unified } from '@astrojs/markdown-remark'
import mdxConfig from './src/lib/markdown.mjs'

// https://astro.build/config
import preact from '@astrojs/preact'

// https://astro.build/config
import partytown from '@astrojs/partytown'

// Font optimization
import webfontDownload from 'vite-plugin-webfont-dl'
import { FontaineTransform } from 'fontaine'

// https://astro.build/config
import netlify from '@astrojs/netlify'

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
  configEnvironment(name) {
    if (name !== 'ssr' && name !== 'prerender') {
      return
    }

    return {
      resolve: {
        external: ['better-sqlite3'],
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
  adapter: netlify({
    imageCDN: false,
  }),
  image: {
    remotePatterns: [{ protocol: 'https' }],
  },
  // Keep the whitespace between inline elements that Astro 7's default
  // 'jsx' mode strips
  compressHTML: true,
  markdown: {
    // The remark/rehype based pipeline. Astro 7 defaults to Sätteri, which
    // can't run our remark and rehype plugins.
    processor: unified(),
    shikiConfig: {
      theme: 'material-theme-lighter',
    },
  },
  vite: {
    plugins: [tailwindcss(), serverDependencies()],
  },
  integrations: [
    mdx({ processor: unified(mdxConfig) }),
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
