import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import formatISO from 'date-fns/formatISO'

import Layout from '../layout/index'
import UserInfo from '../components/UserInfo/UserInfo'
import PostTags from '../components/PostTags/PostTags'
import SocialLinks from '../components/SocialLinks/SocialLinks'
import SEO from '../components/SEO/SEO'
import config from '../../data/SiteConfig'
import { BlogPostBySlugQuery, SitePageContext } from '../../graphql-types'
import './b16-tomorrow-dark.css'
import './post.css'

interface Props {
  data: BlogPostBySlugQuery
  pageContext: SitePageContext
}

const PostTemplate: React.FC<Props> = props => {
  const { data, pageContext } = props
  const { slug } = pageContext
  const postNode = data.markdownRemark
  const post = postNode.frontmatter

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
      </article>
    </Layout>
  )
}

export default PostTemplate

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
