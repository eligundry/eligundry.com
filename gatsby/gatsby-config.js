const urljoin = require('url-join')
const config = require('./data/SiteConfig')

module.exports = {
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
  plugins: [
    'gatsby-plugin-typescript',
    // If things get slow, try this
    // 'gatsby-plugin-no-sourcemaps',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-lodash',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    'gatsby-plugin-catch-links',
    'gatsby-plugin-twitter',
    'gatsby-plugin-sitemap',
    'gatsby-plugin-postcss',
    'gatsby-plugin-zopfli',
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
        path: `${__dirname}/static/`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'posts',
        path: `${__dirname}/content/`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'talks',
        path: `${__dirname}/talks/`,
      },
    },
    {
      resolve: 'gatsby-source-custom-api',
      options: {
        url: 'https://eligundry.com/api/feelings',
        rootKey: 'feelings',
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
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: config.googleAnalyticsID,
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
        setup(ref) {
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
            serialize(ctx) {
              const { rssMetadata } = ctx.query.site.siteMetadata
              return ctx.query.allMarkdownRemark.edges
                .filter(edge => !edge.node.frontmatter.draft)
                .map(edge => ({
                  categories: edge.node.frontmatter.tags,
                  date: edge.node.fields.date,
                  title: edge.node.frontmatter.title,
                  description: edge.node.excerpt,
                  url: `${rssMetadata.site_url}/blog/${edge.node.fields.slug}`,
                  guid: `${rssMetadata.site_url}/blog/${edge.node.fields.slug}`,
                  custom_elements: [
                    { 'content:encoded': edge.node.html },
                    { author: config.userEmail },
                  ],
                }))
            },
            query: `
            {
              allMarkdownRemark(
                limit: 1000,
                sort: { order: DESC, fields: [fields___date] },
              ) {
                edges {
                  node {
                    excerpt
                    html
                    timeToRead
                    fields {
                      slug
                      date
                    }
                    frontmatter {
                      title
                      cover
                      date
                      category
                      tags
                    }
                  }
                }
              }
            }
          `,
            output: config.siteRss,
            title: "Eli Gundry's Blog",
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-graphql-codegen',
      options: {
        documentPaths: [
          './src/**/*.{ts,tsx}',
          './node_modules/gatsby-*/**/*.js',
        ],
      },
    },
    process.env.AWS_ACCESS_KEY_ID &&
      process.env.DO_SPACES_BUCKET &&
      process.env.DO_SPACES_ENDPOINT && {
        resolve: 'gatsby-plugin-s3',
        options: {
          bucketPrefix: 'site',
          bucketName: process.env.DO_SPACES_BUCKET,
          customAwsEndpointHostname: process.env.DO_SPACES_ENDPOINT,
          params: {
            ContentEncoding: 'gzip',
          },
        },
      },
  ].filter(Boolean),
}
