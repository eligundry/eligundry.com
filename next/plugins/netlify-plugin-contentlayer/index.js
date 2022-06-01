const path = require('path')

const shouldSkip = () =>
  process.env.NEXT_PLUGIN_FORCE_RUN === 'false' ||
  process.env.NEXT_PLUGIN_FORCE_RUN === '0' ||
  process.env.NETLIFY_CONTENTLAYER_PLUGIN_SKIP === 'true' ||
  process.env.NETLIFY_CONTENTLAYER_PLUGIN_SKIP === '1'

/**
 * @type {import('@netlify/build').NetlifyPlugin}
 */
const plugin = {
  onPreBuild: async ({ utils: { cache } }) => {
    if (shouldSkip()) {
      console.log('Not restoring cache for netlify-plugin-contentlayer')
      return
    }

    if (await cache.restore(path.join('./', '.contentlayer'))) {
      console.log('Contentlayer cache restored.')
    } else {
      console.log('No Contentlayer layer cache to restore.')
    }
  },
  onPostBuild: async ({ utils: { cache } }) => {
    if (await cache.save(path.join('./', '.contentlayer'))) {
      console.log('Contentlayer cache saved.')
    } else {
      console.log('No Contentlayer cache to save.')
    }
  },
}

module.exports = plugin
