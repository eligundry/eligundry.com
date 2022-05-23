import { allPosts } from 'contentlayer/generated'
import * as dateFns from 'date-fns'
import pick from 'lodash/pick'

export type Post = typeof allPosts[0]
export type PostType = 'blog' | 'talks'
export type Field = keyof Post

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
function getBySlug<Fields extends undefined>(
  postType: PostType,
  slug: string
): Post
function getBySlug<Fields extends Field[]>(
  postType: PostType,
  slug: string,
  fields: Fields
): Pick<Post, typeof fields[number]>
function getBySlug<Fields extends Field[]>(
  postType: PostType,
  slug: string,
  fields?: Fields
) {
  const post = allPosts.find(
    (p) => p.collection === postType && p.slug === slug
  )

  if (fields) {
    return pick(post, fields) as Pick<Post, typeof fields[number]>
  }

  return post
}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
function getAll<Fields extends undefined>(postType: PostType): Post[]
function getAll<Fields extends Field[]>(
  postType: PostType,
  fields: Fields
): Pick<Post, typeof fields[number]>[]
function getAll<Fields extends Field[]>(postType: PostType, fields?: Fields) {
  const posts = allPosts
    .filter((post) => post.collection === postType)
    .filter((post) => {
      if (process.env.NODE_ENV === 'development') {
        return true
      }

      if (post.draft === true) {
        return false
      }

      return true
    })
    .sort((a, b) =>
      dateFns.compareDesc(dateFns.parseISO(a.date), dateFns.parseISO(b.date))
    )

  if (fields) {
    return posts.map(
      (post) => pick(post, fields) as Pick<Post, typeof fields[number]>
    )
  }

  return posts
}

const api = { getAll, getBySlug }

export default api
