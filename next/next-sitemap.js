const fs = require('fs')
const path = require('path')
const git = require('simple-git').default()
const dateFns = require('date-fns')

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://eligundry.com',
  generateRobotsTxt: true,
  autoLastmod: false,
  additionalPaths: async () => {
    const publicHtmlFiles = (await fs.promises.readdir('public')).filter(
      (p) => path.extname(p) === '.html'
    )

    return Promise.all(
      publicHtmlFiles.map(async (file) => ({
        loc: `/${file}`,
        lastmod: (await getLastModFromGit(file))?.toISOString(),
      }))
    )
  },
  transform: async (_, url) => ({
    loc: url,
    lastmod: (await getLastModFromGit(url))?.toISOString(),
    changefreq: 'daily',
    priority: 0.7,
  }),
}

/**
 * @param p {string}
 * @return Promise<Date>
 */
const getLastModFromGit = async (p) => {
  const pathComponentMapping = {
    '/': ['./pages/index.tsx', './components/Home'],
    '/blog': ['./pages/blog/index.tsx', './components/PostListing'],
    '/blog/[slug]': ['./pages/blog/[slug].tsx', './components/Post'],
    '/talks': ['./pages/talks/index.tsx', './components/PostListing'],
    '/talks/[slug]': ['./pages/talks/[slug].tsx', './components/Post'],
    '/feelings': ['./pages/feelings.tsx', './components/Daylio'],
    '/resume': ['./pages/resume.tsx', './components/Resume'],
  }

  if (pathComponentMapping[p]) {
    return getLatestCommitDateForPaths(pathComponentMapping[p])
  }

  if (p.startsWith('/blog/')) {
    return getLatestCommitDateForPaths([
      ...pathComponentMapping['/blog/[slug]'],
    ])
  }

  try {
    if (fs.statSync(path.join('public', p)).isFile) {
      return getLatestCommitDateForPaths([path.join('public', p)])
    }
  } catch (e) {}

  return undefined
}

const getLatestCommitDateForPaths = async (paths) =>
  dateFns.max(
    (await Promise.all(paths.map((file) => git.log({ file })))).map((log) =>
      log?.latest?.date ? dateFns.parseISO(log.latest.date) : undefined
    )
  )
