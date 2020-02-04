import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import formatISO from 'date-fns/formatISO'

import Layout from '../layout'
import UserInfo from '../components/UserInfo/UserInfo'
import PostTags from '../components/PostTags/PostTags'
import SocialLinks from '../components/SocialLinks/SocialLinks'
import SEO from '../components/SEO/SEO'
import Footer from '../components/Footer/Footer'
import config from '../../data/SiteConfig'
import './b16-tomorrow-dark.css'
import './post.css'

export default class PostTemplate extends React.Component {
  render() {
    const { data, pageContext } = this.props
    const { slug } = pageContext
    const postNode = data.markdownRemark
    const post = postNode.frontmatter
    if (!post.id) {
      post.id = slug
    }
    if (!post.category_id) {
      post.category_id = config.postDefaultCategoryID
    }
    return (
      <Layout>
        <Helmet>
          <title>{post.title}</title>
        </Helmet>
        <SEO postPath={slug} postNode={postNode} postSEO />
        <article>
          <header>
            <h1>{post.title}</h1>
            <time dateTime={post.date}>
              {formatISO(new Date(post.date), { representation: 'date' })}
            </time>
          </header>
          <section dangerouslySetInnerHTML={{ __html: postNode.html }} />
          <aside className="post-meta">
            <PostTags tags={post.tags} />
            <SocialLinks postPath={slug} postNode={postNode} />
          </aside>
          <UserInfo config={config} />
          <Footer config={config} />
        </article>
      </Layout>
    )
  }
}

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      timeToRead
      excerpt
      frontmatter {
        title
        cover
        date
        category
        tags
        description
      }
      fields {
        slug
        date
      }
    }
  }
`
