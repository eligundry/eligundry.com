const fs = require('fs')
const path = require('path')
const grayMatter = require('gray-matter')
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
    formats: ['image/webp'],
    minimumCacheTTL: 120,
    domains: [
      'i.gr-assets.com',
      'lastfm.freetls.fastly.net',
      'c.tenor.com',
      'http.cat',
    ],
  },
  eslint: {
    ignoreDuringBuilds: process.env.NETLIFY === 'true' || true,
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
  experimental: {
    nextScriptWorkers: true,
  },
  redirects: async () => {
    // For some reason, Google somehow indexed blog and talk pages from their
    // filename? I need to redirect these pages to the path in frontmatter.slug.
    return [
      {
        source: '/blog/icymi-wiz-khalifa-curren-y-live-in-concert-ep*',
        destination: '/blog/icymi-live-in-concert-ep',
        permanent: true,
      },
      ...['blog', 'talks'].flatMap((contentType) =>
        fs
          .readdirSync(path.join('content', contentType))
          .filter((p) => path.extname(p) === '.mdx')
          .map((p) => {
            const fileSlug = path.basename(p, '.mdx')
            const file = grayMatter.read(path.join('content', contentType, p))

            if (!file.data.slug || file.data.slug === fileSlug) {
              return false
            }

            return {
              source: `/${contentType}/${fileSlug}*`,
              destination: `/${contentType}/${file.data.slug}`,
              permanent: true,
            }
          })
          .filter(Boolean)
      ),
    ]
  },
}

module.exports = withPlugins(
  [
    withTM,
    // withMDX,
    // withBundleAnalyzer,
    withImages,
  ],
  nextConfig
)
