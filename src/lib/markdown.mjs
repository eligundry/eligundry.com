import { fileURLToPath } from 'node:url'
import SimpleGit from 'simple-git'
import readingTime from 'reading-time'
import { defineMdastPlugin } from 'satteri'
import hastAccessibleEmojis from './satteri/hast-accessible-emojis'
import hastUnwrapImages from './satteri/hast-unwrap-images'

const git = SimpleGit()

export const mdastGitLastModified = defineMdastPlugin({
  name: 'git-last-modified',
  async before(_root, ctx) {
    const frontmatter = ctx.data.astro.frontmatter
    frontmatter.modified = new Date()

    if (!ctx.fileURL) return

    try {
      const commits = await git.log({ file: fileURLToPath(ctx.fileURL) })

      if (commits.latest) {
        frontmatter.modified = new Date(commits.latest.date)
      }
    } catch (e) {
      // Not in git yet, keep the current date
    }
  },
})

export const mdastReadingTime = defineMdastPlugin({
  name: 'reading-time',
  before(_root, ctx) {
    ctx.data.astro.frontmatter.readingTime = Math.max(
      1,
      Math.round(readingTime(ctx.source).minutes)
    )
  },
})

/**
 * Options for the Sätteri markdown processor. Astro adds heading IDs (what
 * rehype-slug did) and Shiki highlighting itself, and Sätteri resolves
 * reference links (what remark-inline-links did) when it parses.
 */
const markdownConfig = {
  mdastPlugins: [mdastReadingTime, mdastGitLastModified],
  hastPlugins: [hastAccessibleEmojis, hastUnwrapImages],
}

export default markdownConfig
