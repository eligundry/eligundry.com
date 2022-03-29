require('dotenv').config()

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    providerImportSource: '@mdx-js/react',
  },
})
const withImages = require('next-images')
const withTM = require('next-transpile-modules')(['react-lite-yt-embed'])
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const withPlugins = require('next-compose-plugins')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  images: {
    domains: [
      'i.gr-assets.com',
      'lastfm.freetls.fastly.net',
      'c.tenor.com',
      'http.cat',
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = withPlugins(
  [withTM, withMDX, withBundleAnalyzer, withImages],
  nextConfig
)
