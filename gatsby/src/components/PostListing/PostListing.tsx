import React from 'react'
import { Link } from 'gatsby'
import formatISO from 'date-fns/formatISO'

import './listing.css'

interface Props {
  postEdges: GatsbyTypes.BlogListingQuery['allMarkdownRemark']['edges']
}

const PostListing: React.FC<Props> = ({ postEdges }) => {
  const postList = postEdges.map(postEdge => ({
    path: postEdge?.node?.fields?.slug,
    cover: postEdge?.node?.frontmatter?.cover,
    title: postEdge?.node?.frontmatter?.title,
    date: postEdge?.node?.fields?.date,
    excerpt: postEdge.node.excerpt,
    timeToRead: postEdge.node.timeToRead,
    description: postEdge?.node?.frontmatter?.description,
  }))

  return (
    <main itemScope itemType="http://schema.org/Blog">
      {postList
        .filter(post => !!post.title)
        .map(post => (
          <article
            key={post.path}
            itemScope
            itemProp="blogPosts"
            itemType="http://schema.org/BlogPosting"
            className="listing-post"
          >
            <h1 itemProp="title">
              <Link to={`/blog/${post.path}`} itemProp="url">
                {post.title}
              </Link>
            </h1>
            {post.date && (
              <time dateTime={post.date} itemProp="datePublished">
                <span role="img" aria-labelledby="date of blog post">
                  🗓
                </span>
                {formatISO(new Date(post.date), { representation: 'date' })}
              </time>
            )}
            {post.description && (
              <p itemProp="description" className="description">
                <span role="img" aria-labelledby="description of the blog post">
                  📝
                </span>
                {post.description}
              </p>
            )}
          </article>
        ))}
    </main>
  )
}

export default PostListing
