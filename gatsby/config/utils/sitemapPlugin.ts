import dateMax from 'date-fns/max'

const plugin = {
  resolve: 'gatsby-plugin-sitemap',
  options: {
    query: `
      {
        allSitePage(
          filter: {path: {regex: "/^((?!(404)).)*$/"}}
          sort: {fields: path, order: ASC}
        ) {
          nodes {
            path
            fields {
              latestCommit {
                date
              }
            }
          }
        }
        site {
          siteMetadata {
            siteUrl
          }
        }
        allMdx(
          sort: {fields: frontmatter___slug, order: ASC}
          filter: {frontmatter: {draft: {ne: true}}}
        ) {
          nodes {
            collection
            fields {
              date
              slug
              latestCommit {
                date
              }
            }
          }
        }
        staticHTMLFiles: allFile(filter: {extension: {eq: "html"}}) {
          nodes {
            relativePath
            modifiedTime
          }
        }
        latestFeelingEntry: feeling {
          time
        }
      }
    `,
    resolveSiteUrl: () => 'https://eligundry.com',
    filterPages: () => true,
    resolvePages: (query: SitemapQuery): SitemapSerialize[] => {
      const posts: Record<string, Date> = {}
      let latestPost = new Date(0)
      let latestTalk = new Date(0)

      query.allMdx.nodes.forEach((post) => {
        const postDate = new Date(post.fields.date)
        let path = `/${post.collection}/${post.fields.slug}`

        if (post.collection === 'posts') {
          path = `/blog/${post.fields.slug}`
          latestPost = dateMax([latestPost, postDate])
        } else {
          latestTalk = dateMax([latestTalk, postDate])
        }

        posts[path] = dateMax([
          postDate,
          new Date(post.fields.latestCommit.date),
        ])
      })

      const sitemapEntries = query.allSitePage.nodes
        .filter(({ path }) => path === '/' || !path.endsWith('/'))
        .map(({ path, fields }) => {
          const latestPageCommitDate = fields?.latestCommit?.date
            ? new Date(fields.latestCommit.date)
            : new Date(0)

          if (posts[path]) {
            return {
              path,
              lastmodISO: dateMax([
                posts[path],
                latestPageCommitDate,
              ]).toISOString(),
            }
          }

          if (path === '/blog') {
            return {
              path,
              lastmodISO: dateMax([
                latestPost,
                latestPageCommitDate,
              ]).toISOString(),
            }
          }

          if (path === '/talks') {
            return {
              path,
              lastmodISO: dateMax([
                latestTalk,
                latestPageCommitDate,
              ]).toISOString(),
            }
          }

          if (path === '/' || path === '/feelings') {
            return {
              path,
              lastmodISO: dateMax([
                new Date(query.latestFeelingEntry.time),
                latestPageCommitDate,
              ]).toISOString(),
            }
          }

          return {
            path,
            lastmodISO: latestPageCommitDate?.toISOString(),
          }
        })

      sitemapEntries.push(
        ...query.staticHTMLFiles.nodes.map((node) => ({
          path: `/${node.relativePath}`,
          lastmodISO: new Date(node.modifiedTime).toISOString(),
        }))
      )

      return sitemapEntries
    },
    serialize: ({ path: url, lastmodISO }: SitemapSerialize) => ({
      url,
      lastmodISO,
      changefreq: 'daily',
      priority: 0.7,
    }),
  },
}

interface SitemapSerialize {
  path: string
  lastmodISO?: string
}

interface SitemapQuery {
  allSitePage: {
    nodes: {
      path: string
      fields: null | {
        latestCommit: {
          date: string | null
        }
      }
    }[]
  }
  allMdx: {
    nodes: {
      collection: 'talks' | 'posts'
      fields: {
        date: string
        slug: string
        latestCommit: null | {
          date: string | null
        }
      }
    }[]
  }
  staticHTMLFiles: {
    nodes: {
      relativePath: string
      modifiedTime: string
    }[]
  }
  latestFeelingEntry: {
    time: string
  }
}

export default plugin
