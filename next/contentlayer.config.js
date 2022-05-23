import fs from 'fs'
import path from 'path'
import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import readingTime from 'reading-time'
import SimpleGit from 'simple-git'

// @ts-ignore
import rehypeImagePlaceholder from 'rehype-image-placeholder'
import rehypePrism from 'rehype-prism-plus'
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'
import rehypeSlug from 'rehype-slug'
import remarkUnwrapImages from 'remark-unwrap-images'

const git = SimpleGit()

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: '**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the post',
      required: true,
    },
    description: {
      type: 'string',
      description: 'The description/summary of the post, used in <meta /> tags',
      required: true,
    },
    cover: {
      type: 'string',
      description:
        'The cover image for the post, used in social media previews',
      required: false,
    },
    date: {
      type: 'date',
      description: 'The date the post was published on',
      required: true,
    },
    slug: {
      type: 'string',
      description:
        "The slug of the post. If not defined, the document's filename is used",
      required: false,
    },
    location: {
      type: 'string',
      description: 'The location where a talk post occured',
      required: false,
    },
    tags: {
      type: 'list',
      of: {
        type: 'string',
      },
    },
    draft: {
      type: 'boolean',
    },
  },
  computedFields: {
    slug: {
      type: 'string',
      description:
        "The slug of the post. If not defined, the document's filename is used",
      resolve: (post) => {
        if (post.slug) {
          return post.slug
        }

        return path.basename(post._raw.sourceFileName, '.mdx')
      },
    },
    readingTime: {
      type: 'number',
      description:
        'The amount of time, in minutes, it will take to read this post',
      resolve: async (post) => {
        const body = await fs.promises.readFile(
          path.join('./', 'content', post._raw.sourceFilePath)
        )

        return Math.round(readingTime(body).minutes)
      },
    },
    modified: {
      type: 'date',
      description:
        'The date when the file was last modified according to the Git history',
      resolve: async (post) =>
        git
          .log({ file: path.join('./', 'content', post._raw.sourceFilePath) })
          .then((log) => log.latest?.date),
    },
    collection: {
      type: 'string',
      resolve: (post) => post._raw.sourceFileDir,
    },
    path: {
      type: 'string',
      required: true,
      resolve: (post) => {
        let slug = post.slug

        if (!slug) {
          slug = path.basename(post._raw.sourceFilePath, '.mdx')
        }

        return `/${post._raw.sourceFileDir}/${slug}`
      },
    },
    filepath: {
      type: 'string',
      resolve: (post) =>
        `/${post._raw.sourceFileDir}/${path.basename(
          post._raw.sourceFileName,
          '.mdx'
        )}`,
    },
  },
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Post],
  mdx: {
    rehypePlugins: [
      [rehypePrism],
      [rehypeAccessibleEmojis],
      [rehypeSlug],
      [rehypeImagePlaceholder, { dir: 'public' }],
    ],
    remarkPlugins: [[remarkUnwrapImages]],
  },
})
