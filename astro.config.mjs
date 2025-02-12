import { defineConfig, passthroughImageService } from 'astro/config'
import tailwind from '@astrojs/tailwind'

import mdx from '@astrojs/mdx'
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

// https://astro.build/config
export default defineConfig({
  adapter: netlify({
    imageCDN: false,
  }),
  image: {
    service: passthroughImageService(),
  },
  markdown: {
    shikiConfig: {
      theme: 'material-theme-lighter',
    },
  },
  vite: {
    ssr: {
      external: ['better-sqlite3'],
      noExternal: [
        '@astro-community/astro-embed-youtube',
        '@react-hookz/web',
        'chartjs-adapter-date-fns',
        'react-icons',
      ],
    },
  },
  integrations: [
    tailwind(),
    mdx(mdxConfig),
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
