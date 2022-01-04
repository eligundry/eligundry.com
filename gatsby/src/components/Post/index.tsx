import React from 'react'
import tw, { styled } from 'twin.macro'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import LazyLoad from 'react-lazyload'
import Skeleton from 'react-loading-skeleton'

import Paper from '../Shared/Paper'
import Time from '../Shared/Time'
import EmojiText from '../Shared/EmojiText'

interface Props {
  title: string
  body?: string
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
  <Article itemScope itemType={`https://schema.org/${itemType}`}>
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
    {body && <MDXRenderer itemProp="text">{body}</MDXRenderer>}
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

  & .twitter-tweet {
    margin: 0 auto;
  }

  & img[src*='.gif'] {
    margin: 0 auto;
  }

  & figure {
    figcaption {
      ${tw`italic text-center py-4 font-serif`}
    }
  }

  & .gatsby-resp-iframe-wrapper {
    ${tw`my-4`}
  }

  & .lazyload-footer-wrapper {
    min-height: 270px;
  }

  & .center {
    margin: 1em auto;
  }

  & .float-right {
    ${tw`float-right ml-2 sm:float-none sm:mx-auto`}
  }

  & .float-left {
    ${tw`float-left mr-2 sm:float-none sm:mx-auto`}
  }

  & h1 + h2 {
    ${tw`mt-4`}
  }
`

export default Post
