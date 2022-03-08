import dotenv from 'dotenv'
import { GatsbyConfig } from 'gatsby'
import { urlJoin as urljoin } from 'url-join-ts'

import config from './data/SiteConfig'
import sitemapPlugin from './config/utils/sitemapPlugin'
import feedPlugins from './config/utils/feedPlugin'

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
    ...feedPlugins,
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
