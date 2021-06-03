import React from 'react'
import { Link } from 'gatsby'

import Time from '../Shared/Time'
import EmojiText from '../Shared/EmojiText'
import './listing.css'

interface Props {
  postEdges: GatsbyTypes.BlogListingQuery['allMarkdownRemark']['edges']
  pathPrefix: string
}

const PostListing: React.FC<Props> = ({ postEdges, pathPrefix }) => {
  const postList = postEdges
    .map(postEdge => ({
      path: postEdge?.node?.fields?.slug,
      cover: postEdge?.node?.frontmatter?.cover,
      title: postEdge?.node?.frontmatter?.title,
      date: postEdge?.node?.fields?.date,
      excerpt: postEdge.node.excerpt,
      timeToRead: postEdge.node.timeToRead,
      description: postEdge?.node?.frontmatter?.description,
    }))
    .filter(post => !!post.title)

  return (
    <main>
      {postList.map(post => (
        <article
          key={post.path}
          itemScope
          itemType="http://schema.org/BlogPosting"
          className="listing-post"
        >
          <link itemProp="author" href="#eli-gundry" />
          <h1 itemProp="name">
            <Link to={`/${pathPrefix}/${post.path}`} itemProp="url">
              {post.title}
            </Link>
          </h1>
          {post.date && (
            <Time dateTime={new Date(post.date)} itemProp="datePublished" />
          )}
          {post.description && (
            <p itemProp="description" className="description">
              <EmojiText label="description of the blog post" emoji="📝">
                {post.description}
              </EmojiText>
            </p>
          )}
        </article>
      ))}
    </main>
  )
}

export default PostListing
