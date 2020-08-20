import React from 'react'
import { Link } from 'gatsby'
import formatISO from 'date-fns/formatISO'

import './listing.css'

class PostListing extends React.Component {
  getPostList() {
    return this.props.postEdges.map(postEdge => {
      return {
        path: postEdge.node.fields.slug,
        tags: postEdge.node.frontmatter.tags,
        cover: postEdge.node.frontmatter.cover,
        title: postEdge.node.frontmatter.title,
        date: postEdge.node.fields.date,
        excerpt: postEdge.node.excerpt,
        timeToRead: postEdge.node.timeToRead,
        description: postEdge.node.frontmatter.description,
      }
    })
  }

  render() {
    const postList = this.getPostList()
    const { pathPrefix = 'blog' } = this.props
    return (
      <main itemScope itemType="http://schema.org/Blog">
        {postList.map(post => (
          <article
            key={post.path}
            itemScope
            itemProp="blogPosts"
            itemType="http://schema.org/BlogPosting"
            className="listing-post"
          >
            <h1 itemProp="title">
              <Link to={`/${pathPrefix}/${post.path}`} itemProp="url">
                {post.title}
              </Link>
            </h1>
            <time dateTime={post.date} itemProp="datePublished">
              <span role="img" aria-labelledby="date of blog post">
                🗓
              </span>
              {formatISO(new Date(post.date), { representation: 'date' })}
            </time>
            <p itemProp="description" className="description">
              <span role="img" aria-labelledby="description of the blog post">
                📝
              </span>
              {post.description}
            </p>
          </article>
        ))}
      </main>
    )
  }
}

export default PostListing
