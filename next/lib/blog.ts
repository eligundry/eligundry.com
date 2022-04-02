import path from 'path'
import fs from 'fs'
import * as dateFns from 'date-fns'
import { bundleMDX } from 'mdx-bundler'
import NodeCache from 'node-cache'
import pick from 'lodash/pick'
import SimpleGit from 'simple-git'
// @ts-ignore
import rehypeImagePlaceholder from 'rehype-image-placeholder'
import rehypePrism from 'rehype-prism-plus'
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'
import rehypeSlug from 'rehype-slug'
import remarkReadingType from 'remark-reading-time/mdx'
import remarkUnwrapImages from 'remark-unwrap-images'

const git = SimpleGit()
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
  code: string
  collection: PostType
  filepath: string
  modified?: string
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
    if (fields) {
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

const filterPostFields = (post: Post, fields: Field[]) => {
  const frontmatterKeys = Object.keys(post.frontmatter)

  return pick(
    post,
    fields.map((key) =>
      frontmatterKeys.includes(key) ? `frontmatter.${key}` : key
    )
  )
}

const getFullPostFromPath = async (
  postType: PostType,
  filename: string
): Promise<Post> => {
  const filepath = getPath(postType, filename)
  const { code, frontmatter } = await bundleMDXFile(filepath)
  const slug = frontmatter.slug ?? path.parse(filename).name

  return {
    frontmatter: {
      title: '',
      description: '',
      date: new Date().toISOString(),
      slug,
      draft: false,
      tags: [],
      ...frontmatter,
    },
    code,
    collection: postType,
    path: `/${postType}/${slug}`,
    filepath,
    modified: await git.log({ file: filepath }).then((log) => log.latest?.date),
  }
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

export const bundleMDXFile = async (file: string) =>
  bundleMDX<Partial<Frontmatter>>({
    file,
    mdxOptions: (options) => {
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        [rehypePrism],
        [rehypeAccessibleEmojis],
        [rehypeSlug],
        [rehypeImagePlaceholder, { dir: 'public' }],
      ]
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        [remarkReadingType],
        [remarkUnwrapImages],
      ]

      return options
    },
  })

const api = { getAll, getByFilename, getBySlug }

export default api
