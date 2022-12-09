import { defineConfig } from 'astro/config'

// https://astro.build/config
import tailwind from '@astrojs/tailwind'

// https://astro.build/config
import mdx from '@astrojs/mdx'
import mdxConfig from './src/lib/markdown.mjs'

// https://astro.build/config
import image from '@astrojs/image'

// https://astro.build/config
export default defineConfig({
  vite: {
    ssr: {
      external: ['better-sqlite3'],
      noExternal: [
        '@astro-community/astro-embed-twitter',
        '@astro-community/astro-embed-youtube',
      ],
    },
  },
  integrations: [
    tailwind(),
    mdx(mdxConfig),
    image(),
  ],
})
