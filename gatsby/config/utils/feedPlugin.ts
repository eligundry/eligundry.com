import config from '../../data/SiteConfig'

const plugins = [
  {
    resolve: 'gatsby-plugin-feed',
    options: {
      setup: (ref) => {
        const ret = ref.query.site.siteMetadata.rssMetadata
        ret.allMdx = ref.query.allMdx
        ret.generator = 'GatsbyJS Advanced Starter'
        return ret
      },
      query: `
        {
          site {
            siteMetadata {
              rssMetadata {
                site_url
                feed_url
                title
                description
                copyright
              }
            }
          }
        }
      `,
      feeds: [
        {
          output: config.siteRss,
          title: "Eli Gundry's Blog",
          query: `
            {
              allMdx(
                sort: { order: DESC, fields: [frontmatter___date] },
              ) {
                nodes {
                  slug
                  collection
                  excerpt
                  html
                  frontmatter {
                    title
                    date
                    tags
                    description
                    draft
                  }
                }
              }
            }
          `,
          serialize: (ctx: QueryContext<PostsQuery>) => {
            const { rssMetadata } = ctx.query.site.siteMetadata
            return ctx.query.allMdx.nodes
              .filter((node) => !node.frontmatter.draft)
              .map((node) => ({
                categories: node.frontmatter.tags,
                date: node.frontmatter.date,
                title: node.frontmatter.title,
                description: node?.frontmatter?.description ?? node.excerpt,
                url: `${rssMetadata.site_url}/${
                  node.collection === 'posts' ? 'blog' : node.collection
                }/${node.slug}`,
                guid: `${rssMetadata.site_url}/${
                  node.collection === 'posts' ? 'blog' : node.collection
                }/${node.slug}`,
                custom_elements: [
                  { 'content:encoded': node.html },
                  { author: config.userEmail },
                ],
              }))
          },
        },
      ],
    },
  },
  {
    resolve: 'gatsby-plugin-feed',
    options: {
      setup: () => ({
        title: "Eli Gundry's Feelings",
        description: "A daily journal of how I'm feeling",
        managingEditor: 'eligundry@gmail.com (Eli Gundry)',
        site_url: 'https://eligundry.com/feelings',
        language: 'en-US',
        copyright: `${new Date().getFullYear()} Eli Gundry`,
      }),
      feeds: [
        {
          title: "Eli Gundry's Feelings",
          output: '/feelings.rss',
          query: `
              {
                allFeeling {
                  nodes {
                    time
                    mood
                    notes
                  }
                }
              }
            `,
          serialize: (ctx: QueryContext<FeelingQuery>) =>
            ctx.query.allFeeling.nodes.map((entry) => ({
              date: entry.time,
              author: 'Eli Gundry',
              url: `https://eligundry.com/feelings#${entry.time}`,
              guid: `https://eligundry.com/feelings#${entry.time}`,
              title: `I felt ${entry.mood}`,
              description: `
                  <ul>
                    ${
                      entry.notes
                        ?.map((note) => `<li>${note}</li>`)
                        .join('\n') ?? `<li>No notes!</li>`
                    }
                  </ul>
                `,
            })),
        },
      ],
    },
  },
]

interface FeelingQuery {
  allFeeling: {
    nodes: {
      time: string
      mood: string
      notes: string[]
    }[]
  }
}

interface PostsQuery {
  allMdx: {
    nodes: {
      slug: string
      collection: 'posts' | 'talks'
      excerpt: string
      html: string
      frontmatter: {
        title: string
        date: string
        tags: string[] | null
        description: string | null
        draft: boolean | null
      }
    }[]
  }
}

interface QueryContext<T> {
  query: {
    site: {
      siteMetadata: {
        rssMetadata: {
          site_url: string
          feed_url: string
          title: string
          description: string
          copyright: string
        }
      }
    }
  } & T
}

export default plugins
