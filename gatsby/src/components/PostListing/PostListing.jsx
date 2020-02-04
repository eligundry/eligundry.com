import React from 'react'
import { Link } from 'gatsby'
import formatISO from 'date-fns/formatISO'

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
    return (
      <div>
        {/* Your post list here. */
        postList.map(post => (
          <article>
            <Link to={`/blog/${post.path}`} key={post.path}>
              <h1>{post.title}</h1>
            </Link>
            <time dateTime={post.date}>
              {formatISO(new Date(post.date), { representation: 'date' })}
            </time>
            <p>{post.description}</p>
          </article>
        ))}
      </div>
    )
  }
}

export default PostListing
