import React from 'react'
/* eslint-disable-next-line import/no-unresolved */
import { useMDXComponent } from 'next-contentlayer/hooks'
import Link from 'next/link'
import LazyLoad from 'react-lazyload'
import Skeleton from 'react-loading-skeleton'
import clsx from 'clsx'

import Paper from '@/components/Shared/Paper'
import Time from '@/components/Shared/Time'
import EmojiText from '@/components/Shared/EmojiText'
import LinkButton from '@/components/Shared/LinkButton'
import { Post as PostType } from '@/lib/blog'
import MDXShortcodes from './shortcodes'
import styles from './index.module.scss'

interface Props {
  title: string
  description: string
  path: string
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
  jumpLink?: string
  className?: string
}

const Post: React.FC<Props> = ({
  title,
  body,
  path,
  description,
  datePublished,
  dateModified,
  footer,
  preBody,
  itemType,
  location,
  featuredImageURL,
  readingTime = 0,
  preview = false,
  jumpLink,
  className,
}) => {
  const Component = useMDXComponent(body.code)

  return (
    <Paper
      // @ts-ignore
      itemScope
      itemType={`https://schema.org/${itemType}`}
      className={clsx(styles.article, className)}
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
      <header className={clsx(styles.articleHeader)}>
        <h1 itemProp="name headline">
          <Link href={path}>
            <a itemProp="url">{title}</a>
          </Link>
        </h1>
        <div className={clsx(styles.timeMetadata)}>
          {datePublished && (
            <Time itemProp="datePublished" dateTime={new Date(datePublished)} />
          )}
          {readingTime > 0 && (
            <p>
              <EmojiText
                label="stopwatch denoting time to read article"
                emoji="⏱"
              >
                {readingTime} {readingTime > 1 ? 'Minutes' : 'Minute'}
              </EmojiText>
            </p>
          )}
          {location && (
            <address>
              <EmojiText label="location of talk" emoji="📍">
                {location}
              </EmojiText>
            </address>
          )}
        </div>
        {description && (
          <p itemProp="description" className={styles.description}>
            <EmojiText label="description of the blog post" emoji="📝">
              {description}
            </EmojiText>
          </p>
        )}
      </header>
      {preBody}
      {body && (
        <main className={styles.articleBody} itemProp="text">
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
      {preview && (
        <div>
          <LinkButton
            href={path + (jumpLink ? `#${jumpLink}` : '')}
            anchorProps={{
              className: clsx('inline-block', 'px-4', 'py-2'),
            }}
          >
            Read More ({readingTime} {readingTime > 1 ? 'Minutes' : 'Minute'}){' '}
            <EmojiText
              emoji="➡️"
              label="right arrow prompting you to read more"
            />
          </LinkButton>
        </div>
      )}
    </Paper>
  )
}

export default Post
