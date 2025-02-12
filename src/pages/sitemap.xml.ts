import type { APIRoute, AstroInstance } from 'astro'
import { getCollection } from 'astro:content'
import { SitemapStream, streamToPromise } from 'sitemap'
import * as dateFns from 'date-fns'
import { getLastModifiedForPath } from '../lib/lastModified'

export const GET: APIRoute = async () => {
  const sitemap = new SitemapStream({
    hostname: 'https://eligundry.com',
  })
  const astroFiles = import.meta.glob<AstroInstance>('./*.astro')
  const posts = await getCollection('blog')
  const talks = await getCollection('talks')

  await Promise.all(
    Object.values(astroFiles).map(async (f) => {
      const astroFile = await f()
      const url = (astroFile.url ?? '') + '/'

      sitemap.write({
        url,
        lastmod: dateFns.formatISO(await getLastModifiedForPath(url)),
        changefreq: 'daily',
        priority: 0.7,
      })
    })
  )

  await Promise.all(
    posts.map(async (post) => {
      const url = `/${post.collection}/${post.slug}/`

      sitemap.write({
        url,
        lastmod: dateFns.formatISO(await getLastModifiedForPath(url)),
        changefreq: 'daily',
        priority: 0.7,
      })
    })
  )

  await Promise.all(
    talks.map(async (talk) => {
      const url = `/${talk.collection}/${talk.slug}/`

      sitemap.write({
        url,
        lastmod: dateFns.formatISO(await getLastModifiedForPath(url)),
        changefreq: 'daily',
        priority: 0.7,
      })
    })
  )

  sitemap.end()

  return new Response(await streamToPromise(sitemap), {
    headers: {
      'content-type': 'application/xml',
    },
  })
}
