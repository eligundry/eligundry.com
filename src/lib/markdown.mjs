import SimpleGit from 'simple-git'
import readingTime from 'reading-time'
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'
import rehypeSlug from 'rehype-slug'
import rehypeUnwrapImages from 'rehype-unwrap-images'
import remarkParse from 'remark-parse'
import remarkComment from 'remark-comment'
import remarkInlineLinks from 'remark-inline-links'

const git = SimpleGit()

const mdxConfig = {
  rehypePlugins: [rehypeAccessibleEmojis, rehypeSlug, rehypeUnwrapImages],
  remarkPlugins: [
    remarkReadingTime,
    remarkInlineLinks,
    remarkParse,
    [
      remarkComment,
      {
        ast: true,
      },
    ],
    remarkGitLastModified,
  ],
}

export default mdxConfig

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

export function remarkReadingTime() {
  return function(_tree, file) {
    file.data.astro.frontmatter.readingTime = Math.max(
      1,
      Math.round(readingTime(file.value).minutes)
    )
  }
}
