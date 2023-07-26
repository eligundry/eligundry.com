import { defineConfig, sharpImageService } from 'astro/config'
import tailwind from '@astrojs/tailwind'

import mdx from '@astrojs/mdx'
import mdxConfig from './src/lib/markdown.mjs'

// https://astro.build/config
import preact from '@astrojs/preact'

// https://astro.build/config
import partytown from '@astrojs/partytown'

// https://github.com/danielroe/fontaine
import fontaine from 'astro-fontaine'

// https://astro.build/config
import netlify from '@astrojs/netlify/functions'

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',
  adapter: netlify(),
  experimental: {
    assets: true,
  },
  image: {
    service: sharpImageService(),
  },
  markdown: {
    syntaxHighlight: 'prism',
  },
  vite: {
    ssr: {
      external: ['better-sqlite3', '@atproto/api'],
      noExternal: [
        '@astro-community/astro-embed-youtube',
        '@atproto/api',
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
    fontaine({
      remoteFontFaceStylesheetURLs: [
        'https://fonts.googleapis.com/css2?family=Arvo:ital,wght@0,400;0,700;1,400;1,700&family=Fira+Code&family=Lato:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&display=fallback',
      ],
      defaultFallbacks: [
        'ui-sans-serif',
        'Helvetica Neue',
        'Arial',
        'sans-serif',
      ],
      fonts: [
        {
          family: 'Arvo',
          fallbacks: ['Georgia', 'Cambria'],
        },
        {
          family: 'Lato',
          fallbacks: ['Helvetica Neue', 'Arial', 'sans-serif'],
        },
        {
          family: 'Fira Code',
          fallbacks: [
            'SFMono-Regular',
            'Menlo',
            'Monaco',
            'Consolas',
            'Liberation Mono',
            'Courier New',
            'monospace',
          ],
        },
      ],
    }),
  ],
})
