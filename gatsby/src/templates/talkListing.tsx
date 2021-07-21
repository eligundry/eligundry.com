import React from 'react'
import Helmet from 'react-helmet'
import { graphql, PageProps } from 'gatsby'

import Paper from '../components/Shared/Paper'
import Layout from '../layout'
import PostListing from '../components/PostListing/PostListing'
import SEO from '../components/SEO'

const TalkListing: React.FC<PageProps<
  GatsbyTypes.TalkListingQuery
>> = props => {
  const posts = props.data.allMdx.nodes

  return (
    <Layout>
      <Paper className="listing-container">
        <Helmet title="Talks" />
        <SEO path={props.path} />
        <PostListing posts={posts} pathPrefix="talks" />
      </Paper>
    </Layout>
  )
}

export default TalkListing

export const talkListingQuery = graphql`
  query TalkListing {
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        collection: { eq: "talks" }
        frontmatter: { draft: { ne: true } }
      }
    ) {
      nodes {
        fields {
          slug
          date
          latestCommitDate
        }
        excerpt
        timeToRead
        frontmatter {
          title
          tags
          date
          description
        }
      }
    }
  }
`
