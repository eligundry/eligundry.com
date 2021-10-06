import React from 'react'
import tw, { styled } from 'twin.macro'
import { MDXRenderer } from 'gatsby-plugin-mdx'

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
}) => {
  return (
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
          <p className="location">
            <EmojiText label="location of talk" emoji="📍">
              {location}
            </EmojiText>
          </p>
        )}
      </header>
      {preBody}
      {body && <MDXRenderer itemProp="text">{body}</MDXRenderer>}
      {footer}
    </Article>
  )
}

const Article = styled<React.FC>(Paper.article)`
  & header {
    ${tw`font-sans text-sm md:text-base font-normal text-typographyLite`}

    & h1 {
      ${tw`
        font-bold 
        font-sans 
        break-normal 
        text-typographyDark 
        pb-2 
        text-3xl 
        md:text-4xl
      `}
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
      font-style: italic;
      text-align: center;
    }
  }
`

export default Post
