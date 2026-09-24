import path from 'node:path'
import type { AstroInstance } from 'astro'
import { getCollection, render } from 'astro:content'
import * as dateFns from 'date-fns'
import { simpleGit } from 'simple-git'
import daylio from './daylio'

const git = simpleGit()

export const getLastModFromFile = async (filePath: string): Promise<Date> => {
  return git
    .log({ file: filePath })
    .then((lg) => (lg.latest?.date ? new Date(lg.latest.date) : new Date()))
    .catch((e) => {
      console.error(e)
      return new Date()
    })
}

let allLastModifieds: Promise<Record<string, Date>> | undefined

/**
 * Last modified dates for every page, computed once per process since it
 * renders every post and queries the database.
 */
export function getAllLastModifieds(): Promise<Record<string, Date>> {
  allLastModifieds ??= computeAllLastModifieds()
  return allLastModifieds
}

async function computeAllLastModifieds(): Promise<Record<string, Date>> {
  const lastModifieds = {}

  const [
    astroPages,
    posts,
    talks,
    latestDaylioDate,
    latestResumeExperienceDate,
    latestResumeSectionDate,
  ] = await Promise.all([
    import.meta.glob<AstroInstance>('../pages/*.astro'),
    getCollection('blog'),
    getCollection('talks'),
    daylio.getLatest().then((d) => d.time),
    git
      .log({ file: path.join('src', 'content', 'resumeExperiences') })
      .then((log) => {
        if (!log?.latest?.date) {
          return undefined
        }

        return new Date(log.latest.date)
      }),
    git.log({ file: path.join('src', 'content', 'resume*') }).then((log) => {
      if (!log?.latest?.date) {
        return undefined
      }

      return new Date(log.latest.date)
    }),
  ])
  let latestTalkDate = new Date(0)
  let latestBlogDate = new Date(0)

  await Promise.all(
    posts.map(async (post) => {
      const path = `/${post.collection}/${post.id}/`
      const { remarkPluginFrontmatter } = await render(post)
      // @ts-ignore
      lastModifieds[path] = new Date(remarkPluginFrontmatter.modified)
      latestBlogDate = dateFns.max([latestBlogDate, post.data.date])
    })
  )

  await Promise.all(
    talks.map(async (talk) => {
      const path = `/${talk.collection}/${talk.id}/`
      const { remarkPluginFrontmatter } = await render(talk)
      // @ts-ignore
      lastModifieds[path] = new Date(remarkPluginFrontmatter.modified)
      latestTalkDate = dateFns.max([latestTalkDate, talk.data.date])
    })
  )

  const overrides: Record<string, Date[]> = {
    '/': [latestDaylioDate],
    '/feelings/': [latestDaylioDate],
    '/resume/': [latestResumeExperienceDate, latestResumeSectionDate].filter(
      (d): d is Date => Boolean(d)
    ),
    '/talks/': [latestTalkDate],
    '/blog/': [latestBlogDate],
  }

  await Promise.all(
    Object.values(astroPages).map(async (p) => {
      const page = await p()
      const possibleDates = []

      if (page.url === undefined) {
        return new Date()
      }

      let url = page.url === '' ? '/' : page.url + '/'
      possibleDates.push(await getLastModFromFile(page.file))

      if (overrides[url]?.length) {
        possibleDates.push(...overrides[url])
      }

      // @ts-ignore
      lastModifieds[url] = dateFns.max(possibleDates)
    })
  )

  return lastModifieds
}

export async function getLastModifiedForPath(path: string): Promise<Date> {
  const lastMods = await getAllLastModifieds()
  return lastMods[path] ?? new Date()
}
