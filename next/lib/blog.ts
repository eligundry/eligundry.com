import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'
import * as dateFns from 'date-fns'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize as mdxSerialize } from 'next-mdx-remote/serialize'
import imageSize from 'rehype-img-size'
import rehypePrism from 'rehype-prism-plus'
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'
import rehypeSlug from 'rehype-slug'
import NodeCache from 'node-cache'
import pick from 'lodash/pick'

const cache = new NodeCache({
  stdTTL: 60 * 60 * 1000 * 3,
})

export type PostType = 'blog' | 'talks'

export interface Frontmatter {
  title: string
  description: string
  slug: string
  cover?: string
  draft?: boolean
  date: string
  tags: string[]
  location?: string
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
): Promise<Post> {
  const postPath = getPath(postType, filename)
  const mtime = await fs.promises
    .stat(postPath)
    .then((stat) => dateFns.getUnixTime(stat.mtime))

  const cacheKey = generateCacheKey(postType, filename, mtime)
  let post = cache.get<Post>(cacheKey)

  if (post) {
    if (!!fields) {
      // @ts-ignore
      return filterPostFields(post, fields)
    }

    return post
  }

  post = await getFullPostFromPath(postType, filename)
  cache.set(cacheKey, post)

  if (fields) {
    // @ts-ignore
    return filterPostFields(post, fields)
  }

  return post
}

const filterPostFields = (post: Post, fields: Field[]) =>
  pick(
    post,
    fields.map((key) =>
      // @ts-ignore
      frontmatterFields.includes(key) ? `frontmatter.${key}` : key
    )
  )

const frontmatterFields: (keyof Frontmatter)[] = [
  'title',
  'description',
  'slug',
  'cover',
  'draft',
  'date',
  'tags',
  'location',
  'date',
]

const getFullPostFromPath = async (
  postType: PostType,
  filename: string
): Promise<Post> => {
  const filepath = getPath(postType, filename)
  const fileContents = await fs.promises.readFile(getPath(postType, filename), {
    encoding: 'utf8',
  })
  const { content, data } = matter(fileContents)
  const post: Post = {
    // @ts-ignore
    frontmatter: {},
    content,
    markdown: await renderMarkdownToHTML(content),
    collection: postType,
    path: data.slug
      ? `/${postType}/${data.slug}`
      : `/${postType}/${path.parse(filename).name}`,
    filepath,
  }

  frontmatterFields.forEach((key) => {
    if (!data[key]) {
      return
    }

    switch (key) {
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

      default:
        // @ts-ignore
        post.frontmatter[key] = data?.[key] ?? ''
    }
  })

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
      dateFns.compareDesc(
        dateFns.parseISO(a.frontmatter.date),
        dateFns.parseISO(b.frontmatter.date)
      )
    )
  }

  return posts
}

const generateCacheKey = (
  postType: PostType,
  filename: string,
  mtime: number
) => `${postType}-${filename}-${mtime}`

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
