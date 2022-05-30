import React from 'react'
/* eslint-disable-next-line import/no-unresolved */
import { useMDXComponent } from 'next-contentlayer/hooks'
import LazyLoad from 'react-lazyload'
import Skeleton from 'react-loading-skeleton'

import Paper from '@/components/Shared/Paper'
import Time from '@/components/Shared/Time'
import EmojiText from '@/components/Shared/EmojiText'
import { Post as PostType } from '@/lib/blog'
import MDXShortcodes from './shortcodes'
import styles from './index.module.scss'

interface Props {
  title: string
  body: PostType['body']
  datePublished?: string
  dateModified?: string
  footer?: React.ReactNode
  preBody?: React.ReactNode
  itemType: 'BlogPosting' | 'CreativeWork'
  location?: string
  featuredImageURL?: string
  readingTime?: number
  preview?: boolean
}

const Post: React.FC<Props> = ({
  title,
  body,
  datePublished,
  dateModified,
  footer,
  preBody,
  itemType,
  location,
  featuredImageURL,
  readingTime = 0,
  preview = false,
}) => {
  const Component = useMDXComponent(body.code)

  return (
    <Paper
      // @ts-ignore
      itemScope
      itemType={`https://schema.org/${itemType}`}
      className={styles.article}
      element="article"
      noPadding={preview}
      transparent={preview}
    >
      <link itemProp="author publisher" href="#eli-gundry" />
      {dateModified && <meta itemProp="dateModified" content={dateModified} />}
      {featuredImageURL && <meta itemProp="image" content={featuredImageURL} />}
      {readingTime > 0 && (
        <meta itemProp="timeRequired" content={`PT${readingTime}M`} />
      )}
      <header>
        <h1 itemProp="name headline">{title}</h1>
        {datePublished && (
          <Time itemProp="datePublished" dateTime={new Date(datePublished)} />
        )}
        {location && (
          <address>
            <EmojiText label="location of talk" emoji="📍">
              {location}
            </EmojiText>
          </address>
        )}
      </header>
      {preBody}
      {body && (
        <main className="body" itemProp="text">
          <Component components={MDXShortcodes} />
        </main>
      )}
      {footer && (
        <LazyLoad
          once
          offset={200}
          classNamePrefix="lazyload-footer"
          placeholder={<Skeleton height={270} width="100%" />}
        >
          {footer}
        </LazyLoad>
      )}
    </Paper>
  )
}

export default Post
