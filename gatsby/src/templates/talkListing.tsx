import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'

import { TalkListingQueryQuery } from '../../graphql-types'
import Paper from '../components/Shared/Paper'
import Layout from '../layout'
import PostListing from '../components/PostListing/PostListing'
import SEO from '../components/SEO/SEO'

interface Props {
  data: TalkListingQueryQuery
}

const TalkListing: React.FC<Props> = props => {
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

/* eslint no-undef: "off" */
export const talkListingQuery = graphql`
  query TalkListingQuery {
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
