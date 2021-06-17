import { ITSConfigFn } from 'gatsby-plugin-ts-config'
import urljoin from 'url-join'
import round from 'lodash/round'
import dateMax from 'date-fns/max'

import config from '../data/SiteConfig'

const gatsbyConfig: ITSConfigFn<'config'> = () => ({
  pathPrefix: config.pathPrefix === '' ? '/' : config.pathPrefix,
  assetPrefix: config.assetPrefix,
  siteMetadata: {
    siteUrl: urljoin(config.siteUrl, config.pathPrefix),
    rssMetadata: {
      site_url: urljoin(config.siteUrl, config.pathPrefix),
      feed_url: urljoin(config.siteUrl, config.pathPrefix, config.siteRss),
      title: config.siteTitle,
      description: config.siteDescription,
      image_url: `${urljoin(
        config.siteUrl,
        config.pathPrefix
      )}/logos/logo-512.png`,
      copyright: config.copyright,
    },
  },
  flags: {
    // PRESERVE_WEBPACK_CACHE: true,
    // DEV_SSR: true,
    // PARALLEL_SOURCING: true,
    // PRESERVE_FILE_DOWNLOAD_CACHE: true,
  },
  plugins: [
    'gatsby-plugin-typescript',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-lodash',
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    'gatsby-plugin-catch-links',
    'gatsby-plugin-twitter',
    'gatsby-plugin-postcss',
    'gatsby-plugin-remove-trailing-slashes',
    {
      resolve: 'gatsby-plugin-styled-components',
      options: {
        minify: process.env.NODE_ENV === 'production',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'assets',
        path: `static/`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'posts',
        path: `content/`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'talks',
        path: `talks/`,
      },
    },
    {
      resolve: 'gatsby-source-custom-api',
      options: {
        url: 'https://api.eligundry.com/api/feelings',
        rootKey: 'feelings',
        schemas: {
          feelings: `
            time: String!
            mood: String!
            activities: [String]
            notes: [String!]
          `,
        },
      },
    },
    {
      resolve: 'gatsby-source-custom-api',
      options: {
        url: 'https://api.eligundry.com/api/memes',
        rootKey: 'memes',
        imageKeys: [],
        schemas: {
          memes: `
            url: String!
            size: [Int]
            notes: String!
            created_at: String!
            modified: String!
          `,
        },
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 690,
              quality: 95,
              withWebp: true,
              linkImagesToOriginal: false,
            },
          },
          'gatsby-remark-responsive-iframe',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-autolink-headers',
          'gatsby-remark-prismjs',
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-google-tagmanager',
      options: {
        id: config.googleTagManagerID,
        includeInDevelopment: false,
      },
    },
    {
      resolve: 'gatsby-plugin-nprogress',
      options: {
        color: config.themeColor,
      },
    },
    {
      resolve: 'gatsby-plugin-feed',
      options: {
        setup: ref => {
          const ret = ref.query.site.siteMetadata.rssMetadata
          ret.allMarkdownRemark = ref.query.allMarkdownRemark
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
                image_url
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
              allMarkdownRemark(
                sort: { order: DESC, fields: [frontmatter___date] },
              ) {
                edges {
                  node {
                    collection
                    excerpt
                    html
                    fields {
                      slug
                    }
                    frontmatter {
                      title
                      date
                      tags
                      description
                    }
                  }
                }
              }
            }
          `,
            serialize: ctx => {
              const { rssMetadata } = ctx.query.site.siteMetadata
              return ctx.query.allMarkdownRemark.edges
                .filter(edge => !edge.node.frontmatter.draft)
                .map(edge => ({
                  categories: edge.node.frontmatter.tags,
                  date: edge.node.fields.date,
                  title: edge.node.frontmatter.title,
                  description:
                    edge.node?.description?.frontmatter ?? edge.node.excerpt,
                  url: `${rssMetadata.site_url}/${
                    edge.node.collection === 'posts' ? 'blog' : 'talks'
                  }/${edge.node.fields.slug}`,
                  guid: `${rssMetadata.site_url}/${
                    edge.node.collection === 'posts' ? 'blog' : 'talks'
                  }/${edge.node.fields.slug}`,
                  custom_elements: [
                    { 'content:encoded': edge.node.html },
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
        setup: ref => ({
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
                allFeelings {
                  nodes {
                    time
                    mood
                    notes
                  }
                }
              }
            `,
            serialize: ctx =>
              ctx.query.allFeelings.nodes.map(entry => ({
                date: entry.time,
                author: 'Eli Gundry',
                url: `https://eligundry.com/feelings#${entry.time}`,
                guid: `https://eligundry.com/feelings#${entry.time}`,
                title: `I felt ${entry.mood}`,
                description: `
                  <ul>
                    ${entry.notes?.map(note => `<li>${note}</li>`).join('\n') ??
                      `<li>No notes!</li>`}
                  </ul>
                `,
              })),
          },
        ],
      },
    },
    {
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
              }
            }
            site {
              siteMetadata {
                siteUrl
              }
            }
            allMarkdownRemark(
              sort: {fields: frontmatter___slug, order: ASC}
              filter: {frontmatter: {draft: {ne: true}}}
            ) {
              nodes {
                collection
                fields {
                  date
                  slug
                }
              }
            }
            latestFeelingEntry: feelings {
              time
            }
            latestMeme: memes {
              created_at
            }
          }
        `,
        resolveSiteUrl: () => 'https://eligundry.com',
        filterPages: () => true,
        resolvePages: (query: SitemapQuery): SitemapSerialize[] => {
          const posts: Record<string, string> = {}
          let latestPost = new Date(0)
          let latestTalk = new Date(0)

          query.allMarkdownRemark.nodes.forEach(post => {
            const postDate = new Date(post.fields.date)
            let path = `/${post.collection}/${post.fields.slug}`

            if (post.collection === 'posts') {
              path = `/blog/${post.fields.slug}`
              latestPost = dateMax([latestPost, postDate])
            } else {
              latestTalk = dateMax([latestTalk, postDate])
            }

            posts[path] = postDate.toISOString()
          })

          return query.allSitePage.nodes.map(({ path }) => {
            if (posts[path]) {
              return {
                path,
                lastmodISO: posts[path],
              }
            }

            if (path === '/blog') {
              return {
                path,
                lastmodISO: latestPost.toISOString(),
              }
            }

            if (path === '/talks') {
              return {
                path,
                lastmodISO: latestTalk.toISOString(),
              }
            }

            if (path === '/') {
              return {
                path,
                lastmodISO: query.latestFeelingEntry.time,
              }
            }

            if (path === '/memes') {
              return {
                path,
                lastmodISO: query.latestMeme.created_at,
              }
            }

            return {
              path,
            }
          })
        },
        serialize: (item: SitemapSerialize) => {
          return {
            url: item.path,
            lastmodISO: item.lastmodISO,
            changefreq: 'daily',
            priority: 0.7,
          }
        },
      },
    },
    {
      resolve: 'gatsby-plugin-typegen',
      options: {
        outputPath: './gatsby-types.d.ts',
      },
    },
  ].filter(Boolean),
})

interface SitemapSerialize {
  path: string
  lastmodISO?: string
}

interface SitemapQuery {
  allSitePage: {
    nodes: {
      path: string
    }[]
  }
  allMarkdownRemark: {
    nodes: {
      collection: 'talks' | 'posts'
      fields: {
        date: string
        slug: string
      }
    }[]
  }
  latestFeelingEntry: {
    time: string
  }
  latestMeme: {
    created_at: string
  }
}

export default gatsbyConfig
