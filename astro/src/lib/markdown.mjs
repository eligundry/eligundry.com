import SimpleGit from 'simple-git'
import readingTime from 'reading-time'
import { excerpt, excerptBreakpoint as remarkExcerptBreakpoint } from '@eligundry/remark-excerpt'
import { compile as mdxCompile } from '@mdx-js/mdx'
import rehypePrism from 'rehype-prism-plus'
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'
import rehypeSlug from 'rehype-slug'
import remarkUnwrapImages from 'remark-unwrap-images'
import remarkParse from 'remark-parse'
import remarkComment from 'remark-comment'
import remarkInlineLinks from 'remark-inline-links'

const git = SimpleGit()

const mdxConfig = {
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
    remarkGitLastModified,
    remarkCollection,
    remarkExcerpt,
    remarkExcerptBreakpoint,
  ],
}

export default mdxConfig

// Converts the first dot in `import.meta.env` to its Unicode escape sequence,
// which prevents Vite from replacing strings like `import.meta.env.SITE`
// in our JS representation of loaded Markdown files
function escapeViteEnvReferences(code) {
  return code.replace(/import\.meta\.env/g, 'import\\u002Emeta.env');
}

export function remarkGitLastModified() {
  return async function(_tree, file) {
    try {
      const commits = await git.log({
        file: file.history[0],
      })

      if (!commits.latest) {
        file.data.astro.frontmatter.modified = new Date()
      }

      file.data.astro.frontmatter.modified = new Date(commits.latest.date)
    } catch (e) {
      file.data.astro.frontmatter.modified = new Date()
    }
  }
}

export function remarkCollection() {
  return function(_tree, file) {
    const path = file.history[0]
    file.data.astro.frontmatter.collection = path.includes('talks')
      ? 'talks'
      : 'blog'
  }
}

export function remarkReadingTime() {
  return function(_tree, file) {
    file.data.astro.frontmatter.readingTime = Math.round(
      readingTime(file.value).minutes
    )
  }
}

export function remarkExcerpt() {
  const excerptFn = excerpt({ identifier: 'excerpt' })

  return async function(tree, file, ...blah) {
    const mdx = await mdxCompile(file, {
      ...mdxConfig,
      remarkPlugins: {
        ...mdxConfig.remarkPlugins,
        excerpt,
      }
    })

    console.log(mdx.value.toString())
    // file.data.astro.Excerpt = escapeViteEnvReferences(mdx.value.toString())
  }
}

