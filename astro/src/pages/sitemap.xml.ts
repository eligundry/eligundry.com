import type { APIRoute, MDXInstance, AstroInstance } from 'astro'
import { SitemapStream, streamToPromise } from 'sitemap'
import { simpleGit } from 'simple-git'
import dateFns from 'date-fns'
import daylio from '../lib/daylio'

const git = simpleGit()

const getLastModFromFile = async (
  filePath: string,
  url: string | undefined
): Promise<Date> => {
  const possibleDates = [
    await git
      .log({ file: filePath })
      .then((lg) => (lg.latest?.date ? new Date(lg.latest.date) : new Date()))
      .catch((e) => {
        console.error(e)
        return new Date()
      }),
  ]

  if (url === '' || url === '/feelings') {
    possibleDates.push(await daylio.getLatest().then((d) => d.time))
  }

  return dateFns.max(possibleDates)
}

export const get: APIRoute = async () => {
  const sitemap = new SitemapStream({
    hostname: 'https://eligundry.com',
  })
  const astroFiles = import.meta.glob<AstroInstance>('./**/*.astro')
  const mdxFiles = import.meta.glob<MDXInstance<Record<string, any>>>(
    './**/*.mdx'
  )

  await Promise.all(
    Object.values(astroFiles).map(async (f) => {
      const astroFile = await f()

      sitemap.write({
        url: astroFile.url,
        lastmod: dateFns.formatISO(
          await getLastModFromFile(astroFile.file, astroFile.url)
        ),
        changefreq: 'daily',
        priority: 0.7,
      })
    })
  )

  await Promise.all(
    Object.values(mdxFiles).map(async (f) => {
      const md = await f()

      sitemap.write({
        url: md.url,
        lastmod: dateFns.formatISO(await getLastModFromFile(md.file, md.url)),
        changefreq: 'daily',
        priority: 0.7,
      })
    })
  )

  sitemap.end()

  const body = await streamToPromise(sitemap).then((sm) => sm.toString())

  return {
    body,
  }
}
