import util from 'util'
import fs from 'fs/promises'
import SimpleGit from 'simple-git'
import readingTime from 'reading-time'
import { excerpt } from '@eligundry/remark-excerpt'
import { compile as mdxCompile } from '@mdx-js/mdx'
import { remark } from 'remark'

const git = SimpleGit()

export function remarkGitLastModified() {
  return async function (tree, file) {
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
  return function (tree, file) {
    const path = file.history[0]
    file.data.astro.frontmatter.collection = path.includes('talks')
      ? 'talks'
      : 'blog'
  }
}

export function remarkReadingTime() {
  return function (tree, file) {
    file.data.astro.frontmatter.readingTime = Math.round(
      readingTime(file.value).minutes
    )
  }
}

export function remarkExcerpt() {
  const excerptFn = excerpt({ identifier: 'excerpt' })

  return async function (tree, file) {
    const mdx = await mdxCompile({
      file: file.history[0],
    })

    console.log(mdx)
  }
}
