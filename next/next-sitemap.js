const fs = require('fs')
const path = require('path')
const git = require('simple-git').default()
const dateFns = require('date-fns')
const matter = require('gray-matter')
const axios = require('axios')
const NodeCache = require('node-cache')
const cache = new NodeCache()

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
        changefreq: 'monthly',
        priority: 0.7,
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
 * @return {Promise<Date | undefined>}
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
    const extraDates = []

    if (p === '/' || p === '/feelings') {
      extraDates.push(await getLatestDaylioEntryDate())
    }

    return getLatestCommitDateForPaths(pathComponentMapping[p], extraDates)
  }

  if (p.startsWith('/blog/')) {
    return getLatestCommitDateForPaths([
      ...pathComponentMapping['/blog/[slug]'],
      pathToMarkdownFile[p],
    ])
  }

  if (p.startsWith('/talks/')) {
    return getLatestCommitDateForPaths([
      ...pathComponentMapping['/talks/[slug]'],
      pathToMarkdownFile[p],
    ])
  }

  try {
    if (fs.statSync(path.join('public', p)).isFile) {
      return getLatestCommitDateForPaths([path.join('public', p)])
    }
  } catch (e) {}

  return undefined
}

const getLatestCommitDateForPaths = async (paths, extraDates = []) =>
  dateFns.max(
    (await Promise.all(paths.map((file) => git.log({ file })))).map((log) =>
      log?.latest?.date ? dateFns.parseISO(log.latest.date) : undefined
    ),
    ...extraDates
  )

const pathToMarkdownFile = ['talks', 'blog']
  .flatMap((prefix) =>
    fs
      .readdirSync(path.join(process.cwd(), 'content', prefix))
      .map((filename) => path.join('content', prefix, filename))
  )
  .reduce((acc, filepath) => {
    const fileContents = fs.readFileSync(filepath, { encoding: 'utf8' })
    const { data } = matter(fileContents)
    acc[`/${filepath.includes('blog') ? 'blog' : 'talks'}/${data.slug}`] =
      filepath
    return acc
  }, {})

const getLatestDaylioEntryDate = async () => {
  let latestFeelingsDate = cache.get('latestFeelingsDate')

  if (latestFeelingsDate) {
    return dateFns.parseISO(latestFeelingsDate)
  }

  latestFeelingsDate = await axios
    .get('https://api.eligundry.com/api/feelings')
    .then((resp) => resp.data?.[0].time)

  cache.set('latestFeelingsDate', latestFeelingsDate)

  return dateFns.parseISO(latestFeelingsDate)
}
