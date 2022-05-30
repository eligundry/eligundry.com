import { allPosts, Post as RawPost } from 'contentlayer/generated'
import * as dateFns from 'date-fns'
import pick from 'lodash/pick'
import omit from 'lodash/omit'

export interface Post extends Omit<RawPost, 'body'> {
  body: {
    code: RawPost['body']['code']
  }
}
export type PostType = 'blog' | 'talks'
export type Field = keyof Post

// We never need to send the raw markdown to the client and there isn't an easy
// way to remove the raw field
const filterFields = (post: RawPost | undefined) =>
  omit(post, ['body.raw', 'excerpt.raw'])

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
    return pick(filterFields(post), fields) as Pick<Post, typeof fields[number]>
  }

  return filterFields(post)
}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
function getAll<Fields extends undefined>(postType: PostType): Post[]
function getAll<Fields extends Field[]>(
  postType: PostType,
  fields: Fields
): Pick<Post, typeof fields[number]>[]
function getAll<Fields extends Field[]>(postType: PostType, fields?: Fields) {
  const posts = allPosts
    .filter((post) => {
      if (post.collection !== postType) {
        return false
      }

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
      (post) =>
        pick(filterFields(post), fields) as Pick<Post, typeof fields[number]>
    )
  }

  return posts.map((post) => filterFields(post))
}

const api = { getAll, getBySlug }

export default api
