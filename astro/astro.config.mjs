import { defineConfig } from 'astro/config'

import tailwind from '@astrojs/tailwind'

// https://astro.build/config
import mdx from '@astrojs/mdx'
import mdxConfig from './src/lib/markdown.mjs'

// https://astro.build/config
import image from '@astrojs/image'

// https://astro.build/config
import preact from '@astrojs/preact'

// https://astro.build/config
import partytown from '@astrojs/partytown'

// https://github.com/danielroe/fontaine
import fontaine from 'astro-fontaine'

// https://astro.build/config
export default defineConfig({
  markdown: {
    syntaxHighlight: 'prism',
  },
  vite: {
    ssr: {
      external: ['better-sqlite3'],
      noExternal: [
        '@astro-community/astro-embed-twitter',
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
    image({
      serviceEntryPoint: '@astrojs/image/sharp',
    }),
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
