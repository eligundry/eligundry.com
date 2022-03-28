import React from 'react'
import Head from 'next/head'
import { jsonLdScriptProps } from 'react-schemaorg'
import { WebSite, BreadcrumbList } from 'schema-dts'
import { urlJoin as urljoin } from 'url-join-ts'
import startCase from 'lodash/startCase'

import config from '@/utils/config'
import type { Post } from '@/lib/blog'

interface Props {
  path: string
  title?: string
  description?: string
  image?: string
  post?: Post
}

const SEO: React.FC<Props> = ({
  path,
  post,
  title = '',
  description = config.siteDescription,
  image,
  children,
}) => {
  const schemaOrg: ReturnType<typeof jsonLdScriptProps>[] = []
  const url = urljoin(config.siteUrl, path)

  if (post) {
    if (post.frontmatter?.title) {
      title = post.frontmatter.title
    }

    if (post.frontmatter?.description) {
      description = post.frontmatter.description
    }

    if (post.frontmatter?.cover) {
      image = urljoin(config.siteUrl, post.frontmatter.cover)
    }

    schemaOrg.push(
      jsonLdScriptProps<BreadcrumbList>({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            item: {
              '@id': config.siteUrl,
              name: 'Eli Gundry',
            },
          },
          {
            '@type': 'ListItem',
            position: 2,
            item: {
              '@id': urljoin(config.siteUrl, post.collection),
              name: startCase(post.collection ?? 'Blog'),
            },
          },
          {
            '@type': 'ListItem',
            position: 3,
            item: {
              '@id': url,
              name: title,
            },
          },
        ],
      })
    )
  }

  if (image && !image.startsWith('https://')) {
    image = urljoin(config.siteUrl, image)
  }

  return (
    <Head>
      {/* General tags */}
      <title>
        {title ? `${title} | ${config.siteTitle}` : config.siteTitle}
      </title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      {/* <link rel="icon" href={faviconURL} /> */}
      <link
        rel="alternate"
        type="application/rss+xml"
        title="Eli Gundry's Blog"
        href="/blog.rss"
      />
      <link
        rel="alternate"
        type="application/rss+xml"
        title="Eli Gundry's Feelings"
        href="/feelings.rss"
      />

      {/* OpenGraph tags */}
      <meta property="og:url" content={url} />
      {post && <meta property="og:type" content="article" />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@EliGundry" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      <script
        {...jsonLdScriptProps<WebSite>({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          url: config.siteUrl,
          name: config.siteTitle,
        })}
      />

      {schemaOrg.length > 0 &&
        schemaOrg.map((schema) => (
          <script key={JSON.stringify(schema)} {...schema} />
        ))}

      {children}
    </Head>
  )
}

export default SEO
