import dotenv from 'dotenv'
import { GatsbyConfig } from 'gatsby'
import { urlJoin as urljoin } from 'url-join-ts'

import config from './data/SiteConfig'
import sitemapPlugin from './config/utils/sitemapPlugin'

dotenv.config()

const gatsbyConfig: GatsbyConfig = {
  siteMetadata: {
    siteUrl: urljoin(config.siteUrl, config.pathPrefix),
    rssMetadata: {
      site_url: urljoin(config.siteUrl, config.pathPrefix),
      feed_url: urljoin(config.siteUrl, config.pathPrefix, config.siteRss),
      title: config.siteTitle,
      description: config.siteDescription,
      copyright: config.copyright,
    },
  },
  trailingSlash: 'never',
  plugins: [
    sitemapPlugin,
    'gatsby-plugin-typescript',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-lodash',
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    'gatsby-plugin-catch-links',
    'gatsby-plugin-twitter',
    'gatsby-plugin-sass',
    'gatsby-plugin-netlify',
    'gatsby-plugin-loadable-components-ssr',
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
        path: `posts/`,
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
      resolve: 'gatsby-source-lastfm',
      options: {
        api_key: process.env.LAST_FM_API_KEY,
        username: 'eli_pwnd',
        limit: 1000,
      },
    },
    {
      resolve: '@eligundry/gatsby-source-goodreads',
      options: {
        userID: config.goodreadsUserID,
        shelves: ['currently-reading', 'read'],
      },
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        gatsbyRemarkPlugins: [
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
            serialize: (ctx) => {
              const { rssMetadata } = ctx.query.site.siteMetadata
              return ctx.query.allMdx.edges
                .filter((edge) => !edge.node.frontmatter.draft)
                .map((edge) => ({
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
            serialize: (ctx) =>
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
    {
      resolve: 'gatsby-plugin-web-font-loader',
      options: {
        classes: true,
        events: false,
        custom: {
          families: ['Fira Code', 'Source Serif Pro'],
        },
      },
    },
    {
      resolve: 'gatsby-plugin-typegen',
      options: {
        outputPath: './types/gatsby-types.d.ts',
      },
    },
    {
      resolve: 'gatsby-plugin-use-dark-mode',
      options: {
        classNameDark: 'dark',
        classNameLight: 'light',
        minify: process.env.NODE_ENV === 'production',
      },
    },
  ].filter(Boolean),
}

export default gatsbyConfig
