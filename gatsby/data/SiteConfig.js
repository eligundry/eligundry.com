const config = {
  siteTitle: 'Eli Gundry', // Site title.
  siteUrl: 'https://eligundry.com', // Domain of your website without pathPrefix.
  siteDescription: 'Personal website of Eli Gundry', // Website description used for RSS feeds/meta description tag.
  siteRss: '/rss.xml', // Path to the RSS file.
  copyright: `Copyright © ${new Date().getFullYear()}. Eli Gundry`, // Copyright string for the footer of the website and RSS feed.
  googleTagManagerID: 'GTM-W7KHFLM',
  goodreadsUserID: '29665939',
}

// Validate

// Make sure siteUrl doesn't have an ending forward slash
if (config.siteUrl.substr(-1) === '/')
  config.siteUrl = config.siteUrl.slice(0, -1)

// Make sure siteRss has a starting forward slash
if (config.siteRss && config.siteRss[0] !== '/')
  config.siteRss = `/${config.siteRss}`

module.exports = config
