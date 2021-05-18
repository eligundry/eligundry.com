import React from 'react'
import Helmet from 'react-helmet'
import { graphql, PageProps } from 'gatsby'

import Paper from '../components/Shared/Paper'
import Layout from '../layout'
import PostListing from '../components/PostListing/PostListing'
import SEO from '../components/SEO/SEO'

const TalkListing: React.FC<PageProps<
  GatsbyTypes.TalkListingQuery
>> = props => {
  const postEdges = props.data.allMarkdownRemark.edges

  return (
    <Layout>
      <Paper className="listing-container">
        <Helmet title="Talks" />
        <SEO />
        <PostListing postEdges={postEdges} pathPrefix="talks" />
      </Paper>
    </Layout>
  )
}

export default TalkListing

export const talkListingQuery = graphql`
  query TalkListing {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        collection: { eq: "talks" }
        frontmatter: { draft: { ne: true } }
      }
    ) {
      edges {
        node {
          fields {
            slug
            date
          }
          excerpt
          timeToRead
          frontmatter {
            title
            tags
            cover
            date
            description
          }
        }
      }
    }
  }
`
