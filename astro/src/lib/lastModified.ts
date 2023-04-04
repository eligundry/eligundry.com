import type { AstroInstance } from 'astro'
import { getCollection } from 'astro:content'
import dateFns from 'date-fns'
import { simpleGit } from 'simple-git'
import { cache } from './cache'
import daylio from './daylio'

const git = simpleGit()

const getLastModFromFile = async (filePath: string): Promise<Date> => {
  return git
    .log({ file: filePath })
    .then((lg) => (lg.latest?.date ? new Date(lg.latest.date) : new Date()))
    .catch((e) => {
      console.error(e)
      return new Date()
    })
}

export async function getAllLastModifieds(): Promise<Record<string, Date>> {
  const c = await cache
  let lastModifieds = await c.get<Record<string, Date>>('lastModifieds')

  if (lastModifieds) {
    return lastModifieds
  }

  lastModifieds = {}

  const astroPages = import.meta.glob<AstroInstance>('../pages/*.astro')
  const posts = await getCollection('blog')
  const talks = await getCollection('talks')
  const latestDaylioDate = await daylio.getLatest().then((d) => d.time)

  await Promise.all(
    Object.values(astroPages).map(async (p) => {
      const page = await p()
      const possibleDates = []

      if (page.url === undefined) {
        return new Date()
      }

      let url = page.url === '' ? '/' : page.url + '/'
      possibleDates.push(await getLastModFromFile(page.file))

      if (url === '/' || url.startsWith('/feelings')) {
        possibleDates.push(latestDaylioDate)
      }

      // @ts-ignore
      lastModifieds[url] = dateFns.max(possibleDates)
    })
  )

  await Promise.all(
    posts.map(async (post) => {
      const path = `/${post.collection}/${post.slug}/`
      const { remarkPluginFrontmatter } = await post.render()
      // @ts-ignore
      lastModifieds[path] = new Date(remarkPluginFrontmatter.modified)
    })
  )

  await Promise.all(
    talks.map(async (talk) => {
      const path = `/${talk.collection}/${talk.slug}/`
      const { remarkPluginFrontmatter } = await talk.render()
      // @ts-ignore
      lastModifieds[path] = new Date(remarkPluginFrontmatter.modified)
    })
  )

  await c.set('lastModifieds', lastModifieds, 60 * 3)

  return lastModifieds
}

export async function getLastModifiedForPath(path: string): Promise<Date> {
  const lastMods = await getAllLastModifieds()
  return lastMods[path] ?? new Date()
}
