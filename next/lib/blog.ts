import { allPosts } from 'contentlayer/generated'
import * as dateFns from 'date-fns'
import pick from 'lodash/pick'

export type Post = typeof allPosts[0]
export type PostType = 'blog' | 'talks'
export type Field = keyof Post

interface Filters {
  draft?: boolean
}

const getBySlug = (postType: PostType, slug: string, fields?: Field[]) => {
  const post = allPosts.find(
    (p) => p.collection === postType && p.slug === slug
  )

  if (fields) {
    return pick(post, fields)
  }

  return post
}

const getAll = (postType: PostType, fields?: Field[], filters?: Filters) => {
  let posts = allPosts.filter((post) => post.collection === postType)

  if (filters?.draft === false) {
    posts = posts.filter((post) => !post.draft)
  }

  if (fields && fields.includes('date')) {
    posts.sort((a, b) =>
      dateFns.compareDesc(dateFns.parseISO(a.date), dateFns.parseISO(b.date))
    )
  }

  if (fields) {
    return posts.map((post) => pick(post, fields))
  }

  return posts
}

const api = { getAll, getBySlug }

export default api
