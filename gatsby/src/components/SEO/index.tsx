import React from 'react'
import Helmet from 'react-helmet'
import { helmetJsonLdProp } from 'react-schemaorg'
import { WebSite, BreadcrumbList } from 'schema-dts'
import urljoin from 'url-join'
import startCase from 'lodash/startCase'

import config from '../../../data/SiteConfig'
import { useLatestFeelingsImage } from '../Daylio/useFeelingsImage'

interface Props {
  path: string
  title?: string
  description?: string
  image?: string
  post?:
    | GatsbyTypes.BlogPostBySlugQuery['mdx']
    | GatsbyTypes.TalkBySlugQuery['mdx']
}

const SEO: React.FC<Props> = ({
  path,
  post,
  title = '',
  description = config.siteDescription,
  image,
  children,
}) => {
  const schemaOrg: ReturnType<typeof helmetJsonLdProp>[] = []
  const url = urljoin(config.siteUrl, path)
  const faviconURL = useLatestFeelingsImage()

  if (post) {
    if (post.frontmatter?.title) {
      title = post.frontmatter.title
    }

    if (post.frontmatter?.description) {
      description = post.frontmatter.description
    } else if (post.excerpt) {
      description = post.excerpt
    }

    if (post.frontmatter?.cover?.publicURL) {
      image = urljoin(config.siteUrl, post.frontmatter.cover.publicURL)
    }

    schemaOrg.push(
      helmetJsonLdProp<BreadcrumbList>({
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
              '@id': urljoin(
                config.siteUrl,
                post.collection === 'posts' ? 'blog' : post.collection ?? 'blog'
              ),
              name:
                post.collection === 'posts'
                  ? 'Blog'
                  : startCase(post.collection ?? 'Blog'),
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
    <Helmet
      script={[
        helmetJsonLdProp<WebSite>({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          url: config.siteUrl,
          name: config.siteTitle,
        }),
        ...schemaOrg,
      ]}
    >
      {/* General tags */}
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      <link rel="icon" href={faviconURL} />

      {/* OpenGraph tags */}
      <meta property="og:url" content={url} />
      {post && <meta property="og:type" content="article" />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:creator"
        content={config.userTwitter ? config.userTwitter : ''}
      />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {children}
    </Helmet>
  )
}

export default SEO
