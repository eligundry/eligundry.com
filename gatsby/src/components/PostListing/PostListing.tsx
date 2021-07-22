import React from 'react'
import { Link } from 'gatsby'
import tw, { styled } from 'twin.macro'

import Time from '../Shared/Time'
import EmojiText from '../Shared/EmojiText'
import './listing.css'

interface Props {
  posts:
    | GatsbyTypes.BlogListingQuery['allMdx']['nodes']
    | GatsbyTypes.TalkListingQuery['allMdx']['nodes']
  pathPrefix: string
}

const PostPreview = styled.article`
  ${tw`mb-4`}

  & h1 {
    ${tw`text-lg font-bold`}
  }
`

const PostListing: React.FC<Props> = ({ posts, pathPrefix }) => {
  return (
    <>
      {posts.map(post => (
        <PostPreview
          key={post.fields.slug}
          itemScope
          itemType="https://schema.org/BlogPosting"
          className="listing-post"
        >
          <link itemProp="author publisher" href="#eli-gundry" />
          <meta itemProp="image" content={post.frontmatter.cover?.publicURL} />
          <meta
            itemProp="dateModified"
            content={post.fields.latestCommitDate}
          />
          <h1 itemProp="name headline">
            <Link to={`/${pathPrefix}/${post.fields.slug}`} itemProp="url">
              {post.frontmatter.title}
            </Link>
          </h1>
          {post.frontmatter?.date && (
            <Time
              dateTime={new Date(post.frontmatter.date)}
              itemProp="datePublished"
            />
          )}
          {post.frontmatter?.description && (
            <p itemProp="description" className="description">
              <EmojiText label="description of the blog post" emoji="📝">
                {post.frontmatter.description}
              </EmojiText>
            </p>
          )}
        </PostPreview>
      ))}
    </>
  )
}

export default PostListing
