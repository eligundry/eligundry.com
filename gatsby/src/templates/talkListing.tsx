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
  const postEdges = props.data.allMdx.edges

  return (
    <Layout>
      <Paper className="listing-container">
        <Helmet title="Talks" />
        <SEO path={props.path} />
        <PostListing postEdges={postEdges} pathPrefix="talks" />
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
            date
            description
          }
        }
      }
    }
  }
`
