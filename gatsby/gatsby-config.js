require('dotenv').config()
const { generateConfig } = require('gatsby-plugin-ts-config')

module.exports = generateConfig({
  configDir: 'config',
})
