import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import formatISO from 'date-fns/formatISO'
import tw, { styled, css } from 'twin.macro'

import Layout from '../layout/index'
import PostTags from '../components/PostTags/PostTags'
import SEO from '../components/SEO/SEO'
import Comments from '../components/Comments'
import { BlogPostBySlugQuery, SitePageContext } from '../../graphql-types'
import './b16-tomorrow-dark.css'

interface Props {
  data: BlogPostBySlugQuery
  pageContext: SitePageContext
}

const Article = styled.article`
  & blockquote {
    ${tw`italic border-l-2 border-teal-400 pl-2`}
  }
`

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
      <Article>
        <header>
          <h1>{post.title}</h1>
          <time dateTime={post.date}>
            🗓
            {formatISO(new Date(post.date), { representation: 'date' })}
          </time>
        </header>
        {post.tags && post.tags.includes('icymi') && (
          <blockquote>
            <abbr title="I See You Missed It">ICYMI</abbr> is a series where I
            review and recommend old albums that you may have missed. I used to
            write them in a #music Slack channel at a previous job, but now I
            write them here.
          </blockquote>
        )}
        <section dangerouslySetInnerHTML={{ __html: postNode.html }} />
        <aside className="post-meta">
          <PostTags tags={post.tags} />
        </aside>
        <Comments />
      </Article>
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
