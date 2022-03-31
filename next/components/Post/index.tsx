import React from 'react'
import tw, { styled } from 'twin.macro'
import { MDXRemote } from 'next-mdx-remote'
import LazyLoad from 'react-lazyload'
import Skeleton from 'react-loading-skeleton'

import Paper from '@/components/Shared/Paper'
import Time from '@/components/Shared/Time'
import EmojiText from '@/components/Shared/EmojiText'
import { Post as PostType } from '@/lib/blog'
import MDXShortcodes from './shortcodes'

interface Props {
  title: string
  body: PostType['markdown']
  datePublished?: string
  dateModified?: string
  footer?: React.ReactNode
  preBody?: React.ReactNode
  itemType: 'BlogPosting' | 'CreativeWork'
  location?: string
  featuredImageURL?: string
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
}) => (
  <Article
    // @ts-ignore
    itemScope
    itemType={`https://schema.org/${itemType}`}
  >
    <link itemProp="author publisher" href="#eli-gundry" />
    {dateModified && <meta itemProp="dateModified" content={dateModified} />}
    {featuredImageURL && <meta itemProp="image" content={featuredImageURL} />}
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
        <MDXRemote {...body} components={MDXShortcodes} />
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
  </Article>
)

const Article = styled<React.FC>(Paper.article)`
  & header {
    ${tw`font-normal`}

    & h1 {
      ${tw`
        font-extrabold 
        font-sans 
        break-normal 
        text-typographyDark 
        dark:text-white
        pb-2 
        text-3xl 
        md:text-4xl
      `}
    }

    & > * {
      ${tw`block`}
    }

    & time + address {
      ${tw`mt-0`}
    }
  }

  & .body {
    & .twitter-tweet {
      margin: 0 auto;
    }

    & img[src*='.gif'] {
      margin: 0 auto;
    }

    & figure {
      & > p {
        ${tw`mb-0`}
      }

      figcaption {
        ${tw`italic text-center py-4 font-serif`}
      }

      & + p {
        ${tw`mt-0`}
      }
    }

    & *:not(p, ul, ol) + h1 {
      ${tw`mt-4`}
    }

    & h1 + *:not(p, ul, ol) {
      ${tw`mt-4`}
    }

    & iframe {
      max-width: 100%;
      ${tw`my-4`}
    }

    & .float-right {
      ${tw`float-right ml-2 sm:float-none sm:mx-auto`}
    }

    & .float-left {
      ${tw`float-left mr-2 sm:float-none sm:mx-auto`}
    }

    & .center {
      margin: 1em auto;
    }
  }

  & .lazyload-footer-wrapper {
    min-height: 270px;
  }
`

export default Post
