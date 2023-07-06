import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { Feed } from 'feed'
import dateFns from 'date-fns'
import { insertPrettyFeed } from '../lib/utils'
import config from '../config'

export const get: APIRoute = async () => {
  const posts = (await getCollection('blog')).sort((a, b) =>
    dateFns.compareDesc(a.data.date, b.data.date)
  )
  const author = {
    name: 'Eli Gundry',
    email: 'eligundry@gmail.com',
    link: 'https://eligundry.com/blog',
  }
  const feed = new Feed({
    title: 'Eli Gundry',
    description: config.description,
    id: 'https://eligundry.com/blog/',
    link: 'https://eligundry.com/blog/',
    language: 'en-US',
    copyright: `${new Date().getFullYear()} Eli Gundry`,
    author,
  })

  for (const post of posts) {
    feed.addItem({
      title: post.data.title,
      author: [author],
      id: `${config.url}/${post.collection}/${post.slug}/`,
      link: `${config.url}/${post.collection}/${post.slug}/`,
      date: post.data.date,
      description: post.data.description,
    })
  }

  return new Response(insertPrettyFeed(feed.rss2()), {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'x-content-type-options': 'nosniff',
    },
  })
}
