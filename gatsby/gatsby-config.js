const { useGatsbyConfig } = require('gatsby-plugin-ts-config')
const urljoin = require('url-join')
const config = require('./data/SiteConfig')

require('dotenv').config()

module.exports = useGatsbyConfig(() => require('./config/gatsby-config'), {
  configDir: 'config',
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
