import React from 'react'
import Helmet from 'react-helmet'
import { graphql, PageProps } from 'gatsby'

import Layout from '../layout'
import SEO from '../components/SEO'
import Post from '../components/Post'

const TalkTemplate: React.FC<PageProps<GatsbyTypes.TalkBySlugQuery>> = (
  props
) => {
  const { data, path } = props
  const talkNode = data.mdx
  const talk = talkNode?.frontmatter

  if (!talk?.title) {
    return null
  }

  return (
    <Layout>
      <Helmet>
        <title>{talk.title}</title>
      </Helmet>
      <SEO path={path} post={talkNode} />
      <Post
        title={talk.title}
        body={talkNode?.body}
        itemType="CreativeWork"
        dateModified={talkNode?.fields?.latestCommitDate}
        datePublished={talk.date}
        location={talk.location}
      />
    </Layout>
  )
}

export default TalkTemplate

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query TalkBySlug($slug: String!) {
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
        location
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
