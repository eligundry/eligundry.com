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
    ignoreDuringBuilds: process.env.NETLIFY === 'true',
  },
  typescript: {
    ignoreBuildErrors: process.env.NETLIFY === 'true',
  },
  headers: async () => [
    {
      source: '/(blog|feelings).rss',
      headers: [
        {
          key: 'Content-Type',
          value: 'application/rss+xml; charset=utf-8',
        },
      ],
    },
  ],
  devIndicators: {
    buildActivityPosition: 'bottom-left',
  },
}

module.exports = withPlugins(
  [withTM, withMDX, withBundleAnalyzer, withImages],
  nextConfig
)
