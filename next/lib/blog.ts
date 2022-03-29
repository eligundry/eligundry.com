import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'
import parseISO from 'date-fns/parseISO'
import dateCompareDesc from 'date-fns/compareDesc'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize as mdxSerialize } from 'next-mdx-remote/serialize'
import imageSize from 'rehype-img-size'
import rehypePrism from 'rehype-prism-plus'
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'
import rehypeSlug from 'rehype-slug'

export type PostType = 'blog' | 'talks'

export interface Frontmatter {
  title: string
  description: string
  slug: string
  cover?: string
  draft?: boolean
  date: string
  tags: string[]
}

export interface Post {
  frontmatter: Frontmatter
  path: string
  content: string
  markdown: MDXRemoteSerializeResult<Record<string, unknown>>
  collection: PostType
  filepath: string
}

interface Filters {
  draft?: boolean
}

export type Field = keyof Frontmatter | keyof Omit<Post, 'frontmatter'>

export type Fields = Field[]

const getPath = (postType: PostType, filename?: string) =>
  path.join(process.cwd(), 'content', postType, filename ?? '')

const getFilenames = (postType: PostType) =>
  fs
    .readdirSync(getPath(postType))
    .filter((filename) => path.extname(filename) === '.mdx')

const getBySlug = async (postType: PostType, slug: string, fields?: Fields) =>
  (await getAll(postType, fields)).find((p) => p.frontmatter.slug === slug)

async function getByFilename(
  postType: PostType,
  filename: string,
  fields?: Field[]
): Promise<Post | null> {
  const fileContent = await fs.promises
    .readFile(getPath(postType, filename), { encoding: 'utf8' })
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    .catch(() => {})

  if (!fileContent) {
    return null
  }

  const { content, data } = matter(fileContent)

  if (!fields) {
    return {
      // @ts-ignore
      frontmatter: data,
      content,
      markdown: await renderMarkdownToHTML(content),
      collection: postType,
      path: data.slug
        ? `/${postType}/${data.slug}`
        : `/${postType}/${path.parse(filename).name}`,
      filepath: getPath(postType, filename),
    }
  }

  const post = { frontmatter: {} } as Post

  for (const key of fields) {
    if (
      !data.frontmatter &&
      !['content', 'markdown', 'collection', 'path'].includes(key)
    ) {
      data.frontmatter = {}
    }

    switch (key) {
      case 'content':
        post.content = content
        break

      case 'markdown':
        /* eslint-disable-next-line no-await-in-loop */
        post.markdown = await renderMarkdownToHTML(content)
        break

      case 'collection':
        post.collection = postType
        break

      case 'path':
        if (data.slug) {
          post.path = `/${postType}/${data.slug}`
        } else {
          post.path = `/${postType}/${path.parse(filename).name}`
        }
        break

      case 'date':
        post.frontmatter.date = data[key] ?? new Date().toISOString()
        break

      case 'slug':
        if (!data[key]) {
          post.frontmatter.slug = path.parse(filename).name
        } else {
          post.frontmatter.slug = data[key]
        }
        break

      case 'draft':
        if (typeof data[key] !== undefined) {
          post.frontmatter.draft = !!data[key]
        } else {
          post.frontmatter.draft = false
        }
        break

      case 'tags':
        if (Array.isArray(data[key])) {
          post.frontmatter.tags = data[key]
        } else {
          post.frontmatter.tags = []
        }
        break

      case 'filepath':
        post.filepath = getPath(postType, filename)
        break

      default:
        // @ts-ignore
        post.frontmatter[key] = data?.[key] ?? ''
    }
  }

  return post
}

const getAll = async (
  postType: PostType,
  fields?: Fields,
  filters?: Filters
) => {
  let posts = (
    await Promise.all(
      getFilenames(postType).map((filename) =>
        getByFilename(postType, filename, fields)
      )
    )
  ).filter((post): post is Post => !!post)

  if (filters?.draft === false) {
    posts = posts.filter((post) => post.frontmatter.draft !== true)
  }

  if (fields && fields.includes('date')) {
    posts.sort((a, b) =>
      dateCompareDesc(
        parseISO(a.frontmatter.date),
        parseISO(b.frontmatter.date)
      )
    )
  }

  return posts
}

export const renderMarkdownToHTML = async (markdown: string) =>
  mdxSerialize(markdown, {
    mdxOptions: {
      rehypePlugins: [
        // @ts-ignore
        [imageSize, { dir: 'public' }],
        [rehypePrism],
        [rehypeAccessibleEmojis],
        [rehypeSlug],
      ],
    },
  })

const api = { getAll, getByFilename, getBySlug }

export default api
