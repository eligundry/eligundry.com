const config = {
  siteTitle: 'Eli Gundry', // Site title.
  siteTitleShort: 'GA Starter', // Short site title for homescreen (PWA). Preferably should be under 12 characters to prevent truncation.
  siteTitleAlt: 'GatsbyJS Advanced Starter', // Alternative site title for SEO.
  siteLogo: '/logos/logo-1024.png', // Logo used for SEO and manifest.
  siteUrl: 'https://eligundry.com', // Domain of your website without pathPrefix.
  pathPrefix: '/', // Prefixes all links. For cases when deployed to example.github.io/gatsby-advanced-starter/.
  assetPrefix: 'https://cdn.eligundry.com/site', // The CDN URL for the compiled build
  siteDescription: 'Personal website of Eli Gundry', // Website description used for RSS feeds/meta description tag.
  siteRss: '/rss.xml', // Path to the RSS file.
  siteFBAppID: '1825356251115265', // FB Application ID for using app insights
  googleAnalyticsID: 'UA-41741300-1', // GA tracking ID.
  postDefaultCategoryID: 'Tech', // Default category for posts.
  dateFromFormat: 'YYYY-MM-DD', // Date format used in the frontmatter.
  dateFormat: 'YYYY-MM-DD', // Date format for display.
  postsPerPage: 1000, // Amount of posts displayed per listing page.
  userName: 'Eli Gundry', // Username to display in the author segment.
  userEmail: 'eligundry@gmail.com', // Email used for RSS feed's author segment
  userTwitter: 'EliGundry', // Optionally renders "Follow Me" in the UserInfo segment.
  userLocation: 'Queens, NY', // User location to display in the author segment.
  userAvatar: 'https://api.adorable.io/avatars/150/test.png', // User avatar to display in the author segment.
  userDescription:
    "Yeah, I like animals better than people sometimes... Especially dogs. Dogs are the best. Every time you come home, they act like they haven't seen you in a year. And the good thing about dogs... is they got different dogs for different people.", // User description to display in the author segment.
  copyright: 'Copyright © 2019. Advanced User', // Copyright string for the footer of the website and RSS feed.
  themeColor: '#c62828', // Used for setting manifest and progress theme colors.
  backgroundColor: '#e0e0e0', // Used for setting manifest background color.
  goodreads: {
    userID: '29665939',
    apiKey: 'TSX2BO7dC8AMZstT2H6MBg',
  },
}

// Validate

// Make sure pathPrefix is empty if not needed
if (config.pathPrefix === '/') {
  config.pathPrefix = ''
} else {
  // Make sure pathPrefix only contains the first forward slash
  config.pathPrefix = `/${config.pathPrefix.replace(/^\/|\/$/g, '')}`
}

// Make sure siteUrl doesn't have an ending forward slash
if (config.siteUrl.substr(-1) === '/')
  config.siteUrl = config.siteUrl.slice(0, -1)

// Make sure siteRss has a starting forward slash
if (config.siteRss && config.siteRss[0] !== '/')
  config.siteRss = `/${config.siteRss}`

module.exports = config
