import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'
import parseISO from 'date-fns/parseISO'
import dateCompareDesc from 'date-fns/compareDesc'

export type PostType = 'posts' | 'talks'

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
}

export type Field = keyof Frontmatter | keyof Omit<Post, 'frontmatter'> | 'path'

export type Fields = Field[]

export const getPath = (postType: PostType, filename?: string) =>
  path.join(process.cwd(), 'content', postType, filename ?? '')

export const getFilenames = (postType: PostType) =>
  fs.readdirSync(getPath(postType))

export const getBySlug = (
  postType: PostType,
  slug: string,
  fields?: Fields
) => {}

export const getByFilename = async (
  postType: PostType,
  filename: string,
  fields?: Fields
) => {
  const fileContent = await fs.promises
    .readFile(getPath(postType, filename))
    .catch((e) => {})

  if (!fileContent) {
    return null
  }

  const { content, data } = matter(fileContent)

  if (!fields) {
    return {
      frontmatter: data,
      content,
    } as Post
  }

  return fields.reduce(
    (acc, key) => {
      if (!data.frontmatter && key !== 'content') {
        data.frontmatter = {}
      }

      switch (key) {
        case 'date':
          acc.frontmatter.date = data[key] ?? new Date().toISOString()
          break

        case 'content':
          acc.content = content
          break

        case 'draft':
          if (typeof data[key] !== undefined) {
            acc.frontmatter.draft = !!data[key]
          } else {
            acc.frontmatter.draft = false
          }
          break

        case 'tags':
          if (Array.isArray(data[key])) {
            acc.frontmatter.tags = data[key]
          } else {
            acc.frontmatter.tags = []
          }
          break

        case 'path':
          if (data.slug) {
            acc.path = `/${postType}/${data.slug}`
          } else {
            acc.path = `/${postType}/${path.parse(filename).name}`
          }
          break

        default:
          // @ts-ignore
          acc.frontmatter[key] = data?.[key] ?? ''
      }

      return acc
    },
    { frontmatter: {} } as Post
  )
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

export default { getAll, getByFilename, getBySlug }
