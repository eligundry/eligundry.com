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
    const { pathPrefix = 'blog' } = this.props
    return (
      <main itemScope itemType="http://schema.org/Blog">
        {postList.map(post => (
          <article
            key={post.path}
            itemScope
            itemProp="blogPosts"
            itemType="http://schema.org/BlogPosting"
          >
            <Link to={`/${pathPrefix}/${post.path}`} itemProp="url">
              <h1 itemProp="title">{post.title}</h1>
            </Link>
            <time dateTime={post.date} itemProp="datePublished">
              🗓
              {formatISO(new Date(post.date), { representation: 'date' })}
            </time>
            <p itemProp="description">{post.description}</p>
          </article>
        ))}
      </main>
    )
  }
}

export default PostListing
