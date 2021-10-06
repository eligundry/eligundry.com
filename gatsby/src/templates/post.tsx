import React from 'react'
import Helmet from 'react-helmet'
import { graphql, PageProps } from 'gatsby'

import Layout from '../layout/index'
import SEO from '../components/SEO'
import Comments from '../components/Comments'
import Post from '../components/Post'

const PostTemplate: React.FC<PageProps<
  GatsbyTypes.BlogPostBySlugQuery
>> = props => {
  const { data, path } = props
  const postNode = data.mdx
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
      <Post
        title={post.title}
        body={postNode?.body}
        datePublished={post?.date}
        dateModified={postNode?.fields?.latestCommitDate}
        itemType="BlogPosting"
        featuredImageURL={post.cover?.publicURL}
        footer={
          <>
            <hr />
            <Comments />
          </>
        }
        preBody={
          post?.tags?.includes('icymi') && (
            <blockquote>
              <abbr title="I See You Missed It">ICYMI</abbr> is a series where I
              review and recommend old albums that you may have missed. I used
              to write them in a #music Slack channel at a previous job, but now
              I write them here.
            </blockquote>
          )
        }
      />
    </Layout>
  )
}

export default PostTemplate

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      timeToRead
      excerpt
      collection
      frontmatter {
        title
        cover {
          publicURL
        }
        date
        tags
        description
      }
      fields {
        slug
        date
        latestCommitDate
      }
      body
    }
  }
`
