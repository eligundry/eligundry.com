import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'
import parseISO from 'date-fns/parseISO'
import dateCompareDesc from 'date-fns/compareDesc'
import { serialize as mdxSerialize } from 'next-mdx-remote/serialize'
import imageSize from 'rehype-img-size'

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
  markdown: any
  collection: PostType
}

export type Field = keyof Frontmatter | keyof Omit<Post, 'frontmatter'>

export type Fields = Field[]

export const getPath = (postType: PostType, filename?: string) =>
  path.join(process.cwd(), 'content', postType, filename ?? '')

export const getFilenames = (postType: PostType) =>
  fs
    .readdirSync(getPath(postType))
    .filter((filename) => path.extname(filename) === '.mdx')

export const getBySlug = async (
  postType: PostType,
  slug: string,
  fields?: Fields
) => (await getAll(postType, fields)).find((p) => p.frontmatter.slug === slug)

export async function getByFilename(
  postType: PostType,
  filename: string,
  fields?: Field[]
): Promise<Post | null> {
  const fileContent = await fs.promises
    .readFile(getPath(postType, filename))
    .catch((e) => {})

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
    }
  }

  const post = { frontmatter: {} } as Post

  for (let key of fields) {
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
  }

  return post
}

export const getAll = async (postType: PostType, fields?: Fields) => {
  const posts = (
    await Promise.all(
      getFilenames(postType).map((filename) =>
        getByFilename(postType, filename, fields)
      )
    )
  ).filter((post): post is Post => !!post)

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
      rehypePlugins: [[imageSize, { dir: 'public' }]],
    },
  })

export default { getAll, getByFilename, getBySlug }
