import type { APIRoute, MDXInstance, AstroInstance } from 'astro'
import { getCollection } from 'astro:content'
import { SitemapStream, streamToPromise } from 'sitemap'
import { simpleGit } from 'simple-git'
import dateFns from 'date-fns'
import daylio from '../lib/daylio'
import { getLastModifiedForPath } from '../lib/lastModified'

export const get: APIRoute = async () => {
  const sitemap = new SitemapStream({
    hostname: 'https://eligundry.com',
  })
  const astroFiles = import.meta.glob<AstroInstance>('./*.astro')
  const posts = await getCollection('blog')
  const talks = await getCollection('talks')

  await Promise.all(
    Object.values(astroFiles).map(async (f) => {
      const astroFile = await f()

      sitemap.write({
        url: astroFile.url,
        lastmod: dateFns.formatISO(
          astroFile.url
            ? await getLastModifiedForPath(astroFile.url)
            : new Date()
        ),
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

  const body = await streamToPromise(sitemap).then((sm) => sm.toString())

  return { body }
}
