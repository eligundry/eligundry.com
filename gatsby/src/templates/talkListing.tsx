import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'

import { ListingQueryQuery } from '../../graphql-types'
import Layout from '../layout'
import PostListing from '../components/PostListing/PostListing'
import SEO from '../components/SEO/SEO'

interface Props {
  data: ListingQueryQuery
}

const TalkListing: React.FC<Props> = props => {
  const postEdges = props.data.allMarkdownRemark.edges

  return (
    <Layout>
      <div className="listing-container">
        <div className="posts-container">
          <Helmet title="Talks" />
          <SEO />
          <PostListing postEdges={postEdges} />
        </div>
      </div>
    </Layout>
  )
}

export default TalkListing

/* eslint no-undef: "off" */
export const talkListingQuery = graphql`
  query TalkListingQuery {
    allMarkdownRemark(
      sort: { fields: [fields___date], order: DESC }
      filter: { collection: { eq: "talks" } }
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
