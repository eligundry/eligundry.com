import React from 'react'
import Helmet from 'react-helmet'
import { graphql, PageProps } from 'gatsby'
import formatISO from 'date-fns/formatISO'
import tw, { styled } from 'twin.macro'

import Layout from '../layout/index'
import Paper from '../components/Shared/Paper'
import SEO from '../components/SEO'
import Comments from '../components/Comments'
import { BlogPostBySlugQuery, SitePageContext } from '../../graphql-types'
import './prism-material-light.css'

interface Props {
  data: BlogPostBySlugQuery
  pageContext: SitePageContext
}

const Article = styled<React.FC>(Paper.article)`
  & .twitter-tweet {
    margin: 0 auto;
  }

  & img[src*='.gif'] {
    margin: 0 auto;
  }
`

const PostTemplate: React.FC<PageProps<
  GatsbyTypes.BlogPostBySlugQuery
>> = props => {
  const { data, path } = props
  const postNode = data.markdownRemark
  const post = postNode?.frontmatter

  if (!post) {
    return null
  }

  return (
    <Layout>
      <Helmet>
        <title>{post.title}</title>
      </Helmet>
      <SEO path={path} post={postNode} />
      <Article>
        <header>
          <h1>{post.title}</h1>
          {post?.date && (
            <time dateTime={post.date}>
              🗓
              {formatISO(new Date(post.date), { representation: 'date' })}
            </time>
          )}
        </header>
        {post?.tags?.includes('icymi') && (
          <blockquote>
            <abbr title="I See You Missed It">ICYMI</abbr> is a series where I
            review and recommend old albums that you may have missed. I used to
            write them in a #music Slack channel at a previous job, but now I
            write them here.
          </blockquote>
        )}
        {postNode?.html && (
          <section dangerouslySetInnerHTML={{ __html: postNode.html }} />
        )}
        <hr />
        <aside className="post-meta">
          <Comments />
        </aside>
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
