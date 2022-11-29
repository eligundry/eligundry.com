import { defineConfig } from 'astro/config'

// https://astro.build/config
import tailwind from '@astrojs/tailwind'

// https://astro.build/config
import mdx from '@astrojs/mdx'
import { excerptBreakpoint as remarkExcerptBreakpoint } from '@eligundry/remark-excerpt'
import rehypePrism from 'rehype-prism-plus'
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'
import rehypeSlug from 'rehype-slug'
import remarkUnwrapImages from 'remark-unwrap-images'
import remarkParse from 'remark-parse'
import remarkComment from 'remark-comment'
import remarkInlineLinks from 'remark-inline-links'
import {
  remarkGitLastModified,
  remarkCollection,
  remarkReadingTime,
  remarkExcerpt,
} from './src/lib/markdown.mjs'

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
    mdx({
      rehypePlugins: [rehypePrism, rehypeAccessibleEmojis, rehypeSlug],
      remarkPlugins: [
        remarkReadingTime,
        remarkInlineLinks,
        remarkUnwrapImages,
        remarkParse,
        [
          remarkComment,
          {
            ast: true,
          },
        ],
        remarkExcerpt,
        remarkExcerptBreakpoint,
        remarkGitLastModified,
        remarkCollection,
      ],
    }),
    image(),
  ],
})
