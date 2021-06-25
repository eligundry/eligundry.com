const { generateConfig } = require('gatsby-plugin-ts-config')
const urljoin = require('url-join')
const config = require('./data/SiteConfig')

require('dotenv').config()

module.exports = generateConfig({
  configDir: 'config',
  flags: {
    PRESERVE_WEBPACK_CACHE: true,
    // DEV_SSR: true,
    PARALLEL_SOURCING: true,
    // PRESERVE_FILE_DOWNLOAD_CACHE: true,
  },
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
})
