require('dotenv').config()

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    providerImportSource: '@mdx-js/react',
  },
})
const withTM = require('next-transpile-modules')(['react-lite-yt-embed'])
const withPlugins = require('next-compose-plugins')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  images: {
    domains: ['i.gr-assets.com', 'lastfm.freetls.fastly.net'],
  },
}

module.exports = withPlugins([withTM, withMDX], nextConfig)
